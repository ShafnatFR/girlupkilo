const fs = require('fs');
const { Client } = require('pg');

(async () => {
  const env = fs.readFileSync('.env.local', 'utf8');
  const m = env.match(/^DATABASE_URL=(.+)$/m);
  const c = new Client({ connectionString: m[1] });
  await c.connect();

  // Check if app can grant itself
  const canGrant = await c.query(
    "select has_schema_privilege(current_user, 'public', 'USAGE') as can_usage"
  );
  console.log('can usage:', canGrant.rows[0].can_usage);

  // Check all roles with login
  const roles = await c.query(
    "select rolname, rolsuper, rolcreatedb, rolcreaterole, rolcanlogin from pg_roles where rolcanlogin order by 1"
  );
  console.log('login roles:', roles.rows);

  // Check if app can grant to itself
  try {
    const r = await c.query("grant create on schema public to girlupkilo_app");
    console.log('grant self: SUCCESS');
  } catch (e) {
    console.log('grant self: FAILED -', e.message);
  }

  // Check ACL
  const acl = await c.query(
    "select nspacl::text from pg_namespace where nspname='public'"
  );
  console.log('namespace ACL:', acl.rows[0].nspacl);

  // Check if app can create in public now
  try {
    await c.query('create table public._kilo_test5 (id int)');
    console.log('CREATE TABLE in public: SUCCESS');
    await c.query('drop table public._kilo_test5');
  } catch (e) {
    console.log('CREATE TABLE in public: FAILED -', e.message);
  }

  await c.end();
})().catch((e) => {
  console.error('ERR', e.message);
  process.exit(1);
});