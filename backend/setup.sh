#!/bin/bash

echo "Setting up Campus RMS Backend..."

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file. Please update it with your MySQL credentials."
fi

echo "Setup complete! Next steps:"
echo "1. Update .env with your MySQL credentials"
echo "2. Create MySQL database: CREATE DATABASE campus;"
echo "3. Run: python manage.py makemigrations"
echo "4. Run: python manage.py migrate"
echo "5. Run: python manage.py createsuperuser (optional)"
echo "6. Run: python manage.py runserver"
