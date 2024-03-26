import UserModel from '../../models/users';
import { StatusMessageResponse } from '../../utils';
import { DEFAULT_USER_APP_NAME } from '../../utils/constants';

export const validateBasicAuthBody = async (
  username?: string,
  email?: string,
  password?: string,
  app?: string,
) => {
  let statusMessageResponse = new StatusMessageResponse(
    false,
    'Invalid Payload for Basic Auth',
  );

  if (!username?.trim() && email?.trim() && password?.trim()) {
    statusMessageResponse = new StatusMessageResponse(
      false,
      'Username cannot be empty',
    );
  } else if (username?.trim() && !email?.trim() && password?.trim()) {
    statusMessageResponse = new StatusMessageResponse(
      false,
      'Email cannot be empty',
    );
  } else if (!username?.trim() && !email?.trim() && password?.trim()) {
    statusMessageResponse = new StatusMessageResponse(
      false,
      'Username and Email cannot be empty',
    );
  } else if (!password?.trim()) {
    statusMessageResponse = new StatusMessageResponse(
      false,
      'Password cannt be empty',
    );
  } else if (!app?.trim()) {
    statusMessageResponse = new StatusMessageResponse(
      false,
      'App cannt be empty',
    );
  } else {
    username = username.trim().toLowerCase();
    email = email.trim().toLowerCase();
    if (app === DEFAULT_USER_APP_NAME) app = app.trim().toLowerCase();

    const existingUser: any = await UserModel.findOne({
      $or: [{ username }, { email }],
      app,
    });
    if (existingUser) {
      statusMessageResponse = new StatusMessageResponse(
        false,
        'Username or Email already exists',
      );
    } else {
      statusMessageResponse = new StatusMessageResponse(true, '');
    }
  }

  return statusMessageResponse;
};
