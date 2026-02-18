from django.core.management.base import BaseCommand
from api.models import User

class Command(BaseCommand):
    help = 'Create an admin user'

    def add_arguments(self, parser):
        parser.add_argument('--name', type=str, help='Admin name', default='Admin')
        parser.add_argument('--email', type=str, help='Admin email', default='admin@campus.edu')
        parser.add_argument('--password', type=str, help='Admin password', default='Admin@123')
        parser.add_argument('--phone', type=str, help='Admin phone', default='+1234567890')

    def handle(self, *args, **options):
        name = options['name']
        email = options['email']
        password = options['password']
        phone = options['phone']

        # Check if admin already exists
        if User.objects.filter(email=email).exists():
            self.stdout.write(
                self.style.WARNING(f'Admin user with email {email} already exists')
            )
            return

        # Create admin user
        admin_user = User(
            name=name,
            email=email,
            phone=phone,
            role='ADMIN',
            status='ACTIVE'
        )
        admin_user.set_password(password)
        admin_user.save()

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created admin user: {email}')
        )
        self.stdout.write(f'Name: {name}')
        self.stdout.write(f'Email: {email}')
        self.stdout.write(f'Password: {password}')
        self.stdout.write(f'Phone: {phone}')
        self.stdout.write(f'Role: ADMIN')