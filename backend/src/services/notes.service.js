import { query } from '../db/index.js';

export async function listNotes(userId) {
  const { rows } = await query(
    'SELECT * FROM notes WHERE user_id = $1 ORDER BY updated_at DESC',
    [userId]
  );
  return rows;
}

export async function getNote(userId, id) {
  const { rows } = await query(
    'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return rows[0] || null;
}

export async function createNote(userId, title, content) {
  const { rows } = await query(
    `INSERT INTO notes (user_id, title, content)
     VALUES ($1, $2, $3) RETURNING *`,
    [userId, title, content]
  );
  return rows[0];
}

export async function updateNote(userId, id, title, content) {
  const { rows } = await query(
    `UPDATE notes
     SET title = COALESCE($3, title),
         content = COALESCE($4, content),
         updated_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId, title, content]
  );
  return rows[0] || null;
}

export async function deleteNote(userId, id) {
  const { rowCount } = await query(
    'DELETE FROM notes WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return rowCount > 0;
}
