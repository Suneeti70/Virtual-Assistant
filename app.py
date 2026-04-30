import os
from flask import Flask, render_template, request, jsonify, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from authlib.integrations.flask_client import OAuth
from google import genai
import google.generativeai as genai
from dotenv import load_dotenv # Added to load your secrets
import secrets

# Load environment variables from .env file
load_dotenv()

# --- SECURITY CONFIGURATION ---
# IMPORTANT: These will now pull from Render's Environment Variables or your local .env
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "fallback-secret-for-dev-only")

# Database Setup - Uses SQLite locally, but can be swapped for PostgreSQL on Render easily
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL", "sqlite:///ReadEase.db")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- LOGIN & OAUTH SETUP ---
login_manager = LoginManager(app)
login_manager.login_view = "login_page"

oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

# --- GEMINI CLIENT ---
# Pulls your API key securely
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# --- DATABASE MODELS ---
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
    # Render automatically handles the base URL, but we ensure the callback is secure
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
        response = client.models.generate_content(
            model='gemini-2.0-flash', # Updated to latest stable version
            contents=prompt
        )
        ai_result = response.text
        
        new_entry = History(user_id=current_user.id, input_text=text, output_text=ai_result, mode=mode)
        db.session.add(new_entry)
        db.session.commit()
        
        return jsonify({'result': ai_result, 'id': new_entry.id, 'input': text, 'mode': mode})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    # Check if we are running locally or on Render
    if os.getenv("FLASK_ENV") == "development":
        os.environ['AUTHLIB_INSECURE_TRANSPORT'] = '1'
        app.run(debug=True)
    else:
        # On Render, we don't call app.run() because Gunicorn handles it
        pass
