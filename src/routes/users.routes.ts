/* eslint-disable camelcase */
import { Router } from 'express';
import multer from 'multer';

import AppError from '../errors/AppError';
import uploadConfig from '../config/upload';
import CreateUserService from '../services/CreateUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const uploadMiddleware = multer(uploadConfig);

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  const userWithoutPassword = {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  return response.json(userWithoutPassword);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  uploadMiddleware.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService();

    if (!request.file) {
      throw new AppError('Missing "avatar" file.');
    }

    const {
      id,
      name,
      email,
      created_at,
      updated_at,
    } = await updateUserAvatar.execute({
      userId: request.user.id, // filled by the ensureAuthenticated middleware
      avatarFilename: request.file.filename, // filled by the uploadMiddleware
    });

    const userWithoutPassword = { id, name, email, created_at, updated_at };

    return response.json(userWithoutPassword);
  }
);

export default usersRouter;
