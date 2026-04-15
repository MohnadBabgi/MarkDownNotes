import * as service from '../services/notes.service.js';

export async function list(req, res, next) {
  try {
    const notes = await service.listNotes(req.user.id);
    res.json(notes);
  } catch (e) { next(e); }
}

export async function getById(req, res, next) {
  try {
    const note = await service.getNote(req.user.id, req.params.id);
    if (!note) return res.status(404).json({ error: 'Not found' });
    res.json(note);
  } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const { title, content } = req.body;
    if (!title || content == null) {
      return res.status(400).json({ error: 'title and content required' });
    }
    const note = await service.createNote(req.user.id, title, content);
    res.status(201).json(note);
  } catch (e) { next(e); }
}

export async function update(req, res, next) {
  try {
    const { title, content } = req.body;
    const note = await service.updateNote(req.user.id, req.params.id, title, content);
    if (!note) return res.status(404).json({ error: 'Not found' });
    res.json(note);
  } catch (e) { next(e); }
}

export async function remove(req, res, next) {
  try {
    const ok = await service.deleteNote(req.user.id, req.params.id);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (e) { next(e); }
}
