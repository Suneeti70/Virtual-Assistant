import os
from flask import Flask, render_template, request, jsonify, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from authlib.integrations.flask_client import OAuth
import google.generativeai as genai
from dotenv import load_dotenv

# Load local .env file if it exists
load_dotenv()

app = Flask(__name__)

# --- CONFIGURATION ---
# Use environment variables with fallbacks for safety
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev-secret-key-123")

# Render uses a dynamic database path; this handles both local and cloud
database_url = os.getenv("DATABASE_URL", "sqlite:///MaSU.db")
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- LOGIN MANAGER ---
login_manager = LoginManager(app)
login_manager.login_view = "login_page"

# --- OAUTH SETUP ---
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

# --- GEMINI SETUP ---
# Using the stable configuration method
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

# --- MODELS ---
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
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/login/google')
def login_google():
    # External=True is vital for OAuth to find the correct Render URL
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
@login_required
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
        response = model.generate_content(prompt)
        ai_result = response.text
        
        new_entry = History(user_id=current_user.id, input_text=text, output_text=ai_result, mode=mode)
        db.session.add(new_entry)
        db.session.commit()
        
        return jsonify({'result': ai_result, 'id': new_entry.id, 'input': text, 'mode': mode})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
with app.app_context():
        db.create_all()
# --- STARTUP ---
if __name__ == '__main__':
    
    
    # Check if local development
    if os.getenv("FLASK_ENV") == "development":
        os.environ['AUTHLIB_INSECURE_TRANSPORT'] = '1'
        app.run(debug=True)
    else:
        # On Render, Gunicorn handles the start; this is just a backup
        port = int(os.environ.get("PORT", 5000))
        app.run(host='0.0.0.0', port=port)
