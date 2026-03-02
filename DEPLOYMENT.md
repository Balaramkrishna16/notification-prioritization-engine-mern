Focus: Production Environment Stability.

Production Checklist
[ ] SSL/TLS: Ensure all traffic is forced over HTTPS.

[ ] CORS: Strict origin white-listing (no wildcards *).

[ ] Environment: Ensure NODE_ENV is set to production to disable verbose error logging.

[ ] Database: Enable IP Whitelisting (0.0.0.0/0 for Render) and use strong IAM roles.