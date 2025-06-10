# Odin Research Project - Database Schema

This folder contains the complete PostgreSQL/Supabase database schema for the Odin Research Project application. The schema is designed to support a comprehensive research collaboration platform with AI-powered features.

## Schema Overview

The database is organized into 5 main schema files:

### 1. Users and Authentication (`01_users_and_auth.sql`)
- **users** - Core user information and authentication
- **user_profiles** - Extended profile information (university, department, research interests)
- **user_sessions** - Session management for authentication
- **password_reset_tokens** - Password reset functionality
- **email_verification_tokens** - Email verification system

### 2. Research Projects (`02_research_projects.sql`)
- **research_projects** - Main project entities with metadata
- **project_collaborators** - Many-to-many relationship for project collaboration
- **project_tags** - Tagging system for categorization
- **project_tag_associations** - Project-tag relationships
- **project_files** - File attachments and uploads
- **project_activities** - Activity log for audit trail
- **project_metrics** - Analytics and usage metrics
- **project_likes** - User likes/favorites system

### 3. Chat and Messages (`03_chat_and_messages.sql`)
- **chat_sessions** - Conversation containers linked to projects
- **chat_messages** - Individual messages with AI/user distinction
- **message_reactions** - User reactions to messages (likes, helpful, etc.)
- **ai_responses** - AI model metadata and performance tracking
- **message_attachments** - File attachments in conversations
- **chat_participants** - Multi-user conversation support
- **chat_templates** - Reusable prompt templates
- **user_chat_preferences** - User preferences for AI interactions

### 4. Research Analytics (`04_research_analytics.sql`)
- **research_analytics** - Time-series analytics data
- **research_milestones** - Achievement tracking
- **research_trends** - Trend analysis and patterns
- **research_goals** - Goal setting and progress tracking
- **collaboration_analytics** - Network analysis of collaborations
- **research_impact** - Impact metrics (citations, altmetrics)
- **analytics_preferences** - User dashboard preferences
- **comparative_analytics** - Year-over-year and peer comparisons

### 5. Document Management (`05_document_management.sql`)
- **research_documents** - Document storage and metadata
- **document_versions** - Version control system
- **document_sections** - Structured document sections
- **document_comments** - Annotation and review system
- **document_templates** - Document templates for different types
- **document_references** - Citation and bibliography management
- **document_attachments** - Figures, tables, and supplementary files
- **document_permissions** - Fine-grained access control

## Key Features

### Security
- **Row Level Security (RLS)** enabled on all user-facing tables
- **Comprehensive policies** for data access control
- **UUID primary keys** for security and scalability
- **Supabase Auth integration** with `auth.uid()` references

### Performance
- **Strategic indexing** on frequently queried columns
- **Optimized for typical research workflows**
- **Efficient many-to-many relationships**
- **Proper foreign key constraints**

### Data Integrity
- **Check constraints** for data validation
- **Referential integrity** with CASCADE deletes where appropriate
- **Timestamp tracking** with automatic update triggers
- **Version control** for critical documents

### Analytics Ready
- **Time-series data structure** for historical analysis
- **Metrics aggregation** tables for dashboard performance
- **Flexible JSONB fields** for extensible metadata
- **Comparative analysis** support

## Installation Instructions

### For Supabase

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Run the schema files in order** using the Supabase SQL Editor:
   ```sql
   -- Execute these files in the SQL Editor, one at a time:
   -- 1. 01_users_and_auth.sql
   -- 2. 02_research_projects.sql
   -- 3. 03_chat_and_messages.sql
   -- 4. 04_research_analytics.sql
   -- 5. 05_document_management.sql
   ```

3. **Configure Authentication** in the Supabase dashboard:
   - Enable email/password authentication
   - Configure email templates for verification/reset
   - Set up any OAuth providers if needed

4. **Set up Storage** for file uploads:
   - Create buckets for project files, documents, and attachments
   - Configure storage policies to match the database RLS policies

### For Local PostgreSQL

1. **Install PostgreSQL** (version 13+ recommended)

2. **Create database**:
   ```bash
   createdb odin_research
   ```

3. **Run schema files**:
   ```bash
   psql -d odin_research -f 01_users_and_auth.sql
   psql -d odin_research -f 02_research_projects.sql
   psql -d odin_research -f 03_chat_and_messages.sql
   psql -d odin_research -f 04_research_analytics.sql
   psql -d odin_research -f 05_document_management.sql
   ```

## Environment Configuration

Create a `.env` file with your database connection details:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Or PostgreSQL Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/odin_research
```

## Data Migration and Seeding

Consider creating seed data for:
- Default document templates
- Common chat templates
- Sample research categories/tags
- Default analytics preferences

## Monitoring and Maintenance

### Regular Tasks
- Monitor table sizes and index usage
- Review and optimize slow queries
- Clean up expired tokens and old sessions
- Archive old analytics data

### Analytics Tables
- Consider partitioning large analytics tables by date
- Implement data retention policies
- Set up automated aggregation jobs

## API Integration

This schema is designed to work seamlessly with:
- **Supabase Auto-generated APIs**
- **GraphQL endpoints**
- **Real-time subscriptions**
- **PostgREST for direct SQL access**

## Security Considerations

- All user data is protected by Row Level Security
- Sensitive operations require appropriate permissions
- File uploads should be scanned for security
- Regular security audits recommended

## Schema Evolution

When making changes:
1. Create migration scripts
2. Test on development environment
3. Backup production data
4. Apply migrations during maintenance windows
5. Update application code accordingly

## Support

For questions about this schema:
1. Check the inline comments in each SQL file
2. Review the application interfaces for context
3. Consider the intended user workflows
4. Consult PostgreSQL and Supabase documentation

---

**Note**: This schema was generated based on the TypeScript interfaces found in the Odin Research Project React application. It's designed to support all current features while providing flexibility for future enhancements. 