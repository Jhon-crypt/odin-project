# Database Schema

This directory contains the PostgreSQL schema definitions for the Supabase database.

## Invited Users Schema

File: `01_invited_users.sql`

The invited users schema manages access control for users who have been invited to the platform. It tracks:

- Email addresses of invited users
- IP addresses for security monitoring
- Access timestamps and counts
- Invitation status

### Security Features

1. Row Level Security (RLS) enabled
2. Read access restricted to authenticated users
3. Write access restricted to service role
4. IP address tracking for security monitoring

### Automatic Features

1. UUID generation for unique IDs
2. Timestamp tracking for invitations
3. Access count incrementing
4. Last access time updates

### Indexes

- Email index for fast lookups
- IP address index for security monitoring

## How to Apply

1. Connect to your Supabase project
2. Open the SQL editor
3. Copy and paste the contents of the SQL files
4. Execute the queries in numerical order

## Security Considerations

- Email addresses are unique
- IP addresses are stored using the INET type for proper IP address handling
- Row Level Security ensures proper access control
- Service role required for modifications 