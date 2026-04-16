import os
from flask import Flask, render_template, request, jsonify, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from authlib.integrations.flask_client import OAuth
from google import genai
import secrets

# Enable insecure transport for local development login testing
os.environ['AUTHLIB_INSECURE_TRANSPORT'] = '1'

app = Flask(__name__)
# Generated a more secure secret key
app.secret_key = "ef00958874731ad676e5d748b8ed19637e9c8e6e0ef44bff"

# 1. Database Setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///MaSU.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# 2. Login Manager
login_manager = LoginManager(app)
login_manager.login_view = "login_page" # Redirect to login page if not authenticated

# 3. Google OAuth
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id="80861385010-ra8i7pg2jsnkrna5dm0idara02ci30ue.apps.googleusercontent.com",
    client_secret="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",
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

# 4. Gemini Client
client = genai.Client(api_key="AIzaSyCKuY7QlrOO6RA_4Z5fb8-wCsbigECLjL4")


# 5. Database Models
class User(UserMixin, db.Model):
    id = db.Column(db.String(100), primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    history = db.relationship('History', backref='user', lazy=True)

class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), db.ForeignKey('user.id'))
    input_text = db.Column(db.Text)
    output_text = db.Column(db.Text)
    mode = db.Column(db.String(50))

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

# --- ROUTES ---

@app.route('/login')
def login_page():
    # If already logged in, redirect to dashboard
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/login/google')
def login_google():
    redirect_uri = url_for('authorize', _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route('/login/callback')
def authorize():
    token = google.authorize_access_token()
    user_info = token.get('userinfo')
    
    user = User.query.get(user_info['sub'])
    if not user:
        user = User(id=user_info['sub'], name=user_info['name'], email=user_info['email'])
        db.session.add(user)
        db.session.commit()
        
    login_user(user)
    return redirect(url_for('index'))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login_page'))

@app.route('/')
@login_required # Dashboard requires login
def index():
    user_history = History.query.filter_by(user_id=current_user.id).order_by(History.id.desc()).limit(10).all()
    return render_template('index.html', history=user_history)

@app.route('/api/generate', methods=['POST'])
@login_required
def generate():
    data = request.json
    text = data.get('text', '')
    mode = data.get('mode', 'Summarize')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    prompt = f"Please {mode.lower()} the following text clearly:\n\n{text}"

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        ai_result = response.text
        
        # Save to DB
        new_entry = History(user_id=current_user.id, input_text=text, output_text=ai_result, mode=mode)
        db.session.add(new_entry)
        db.session.commit()
        
        # Return both response and newly created ID so JS can inject it dynamically
        return jsonify({'result': ai_result, 'id': new_entry.id, 'input': text, 'mode': mode})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
    
