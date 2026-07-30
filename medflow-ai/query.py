import psycopg
url = 'postgresql://postgres:healthcare@healthcare-db.cdu4ym0ac08t.ap-southeast-2.rds.amazonaws.com:5432/postgres?schema=public'
with psycopg.connect(url) as conn:
    with conn.cursor() as cur:
        cur.execute('SELECT sender, message FROM chat_history ORDER BY id DESC LIMIT 5;')
        rows = cur.fetchall()
        for r in rows:
            print(f'SENDER: {r[0]}')
            print(f'MESSAGE: {r[1]}')
            print('-'*40)
