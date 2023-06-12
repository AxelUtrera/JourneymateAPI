const UserService = require('../../services/userServices');
const UserController = require('../../controllers/usersController');
const CodeStatus = require('../../models/codeStatus');


describe('test for userByUsername', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });


  it('should return the user when found', async () => {
    const req = {
      params: {
        username: 'johndoe',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const user = {
      id: 1,
      username: 'johndoe',
      email: 'johndoe@example.com',
    };

    jest.spyOn(UserService, 'getUserByUsername').mockResolvedValue(user);

    await UserController.userByUsername(req, res);

    expect(UserService.getUserByUsername).toHaveBeenCalledWith(req.params.username);
    expect(res.status).toHaveBeenCalledWith(CodeStatus.OK);
    expect(res.json).toHaveBeenCalledWith({
      code: CodeStatus.OK,
      msg: "User found",
      result: user,
    });
  });


  it('should return an error message when the user is not found', async () => {
    const req = {
      params: {
        username: 'Test',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(UserService, 'getUserByUsername').mockResolvedValue(null);

    await UserController.userByUsername(req, res);

    expect(UserService.getUserByUsername).toHaveBeenCalledWith(req.params.username);
    expect(res.status).toHaveBeenCalledWith(CodeStatus.INVALID_DATA);
  });




  it('should handle error during getUserByUsername and return an error message', async () => {
    const req = {
      params: {
        username: 'johndoe',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const error = new Error('Database connection failed');
    jest.spyOn(UserService, 'getUserByUsername').mockRejectedValue(error);

    await UserController.userByUsername(req, res);

    expect(UserService.getUserByUsername).toHaveBeenCalledWith(req.params.username);
    expect(res.status).toHaveBeenCalledWith(CodeStatus.INVALID_DATA);
    expect(res.json).toHaveBeenCalledWith({
      code: CodeStatus.INVALID_DATA,
      msg: 'There is an error',
      result: null
    });
  });
});


describe('validateNotEmptyData', () => {
  it('should return OK when all fields are provided', () => {
    const user = {
      name: 'John',
      lastname: 'Doe',
      age: 25,
      email: 'john@example.com',
      username: 'johndoe',
      password: 'password123'
    };

    const result = UserController.validateNotEmptyData(user);

    expect(result).toBe(CodeStatus.OK);
  });

  it('should return DATA_REQUIRED when a field is missing', () => {
    const user = {
      name: 'John',
      lastname: 'Doe',
      age: 25,
      email: 'john@example.com',
      username: 'johndoe'
      //password is missing
    };

    const result = UserController.validateNotEmptyData(user);

    expect(result).toBe(CodeStatus.DATA_REQUIRED);
  });

});


describe('deleteUser', () => {
  it('should delete a user successfully', async () => {
    const usernameToDelete = 'johndoe';

    // Mock userService.findUserByUsername for returns an existan username
    jest.spyOn(UserService, "findUserByUsername").mockResolvedValueOnce({ username: usernameToDelete });

    // Mock userService.deleteUserByUsername for it does nothing
    jest.spyOn(UserService, "deleteUserByUsername").mockResolvedValueOnce();

    const req = {
      params: {
        username: usernameToDelete
      }
    };

    const res = {
      json: jest.fn()
    };

    await UserController.deleteUser(req, res);

    expect(res.json).toHaveBeenCalledWith({
      code: CodeStatus.OK,
      msg: `User ${usernameToDelete} was eliminated...`
    });
  });

  it('should return an error for non-existent user', async () => {
    const usernameToDelete = 'nonexistentuser';

    // Mock userService.findUserByUsername para que devuelva null
    jest.spyOn(UserService, "findUserByUsername").mockResolvedValueOnce(null);

    const req = {
      params: {
        username: usernameToDelete
      }
    };

    const res = {
      json: jest.fn()
    };

    await UserController.deleteUser(req, res);

    expect(res.json).toHaveBeenCalledWith({
      code: CodeStatus.INVALID_DATA,
      msg: `User ${usernameToDelete} doesn't exist...`
    });
  });

  it('should handle errors during deletion', async () => {
    const usernameToDelete = 'johndoe';
    const errorMessage = 'An error occurred during deletion';

    // Mock userService.findUserByUsername to return an existant user.
    jest.spyOn(UserService, "findUserByUsername").mockResolvedValueOnce({ username: usernameToDelete });

    // Mock userService.deleteUserByUsername to it throws an error
    jest.spyOn(UserService, "deleteUserByUsername").mockRejectedValueOnce(CodeStatus.PROCESS_ERROR);

    const req = {
      params: {
        username: usernameToDelete
      }
    };

    const res = {
      json: jest.fn()
    };

    await UserController.deleteUser(req, res);

    expect(res.json).toHaveBeenCalledWith({
      code: CodeStatus.PROCESS_ERROR,
      msg: 'There is an error while deleting the user...'
    });
  });
});


describe('validateDataTypesEntry', () => {
  it('should return OK when all data types are valid', () => {
    const user = {
      name: 'John',
      lastname: 'Doe',
      age: 25,
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123'
    };

    const result = UserController.validateDataTypesEntry(user);

    expect(result).toBe(CodeStatus.OK);
  });


  it('should return DATA_REQUIRED when name is not a string', () => {
    const user = {
      name: 123,
      lastname: 'Doe',
      age: 25,
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123'
    };

    const result = UserController.validateDataTypesEntry(user);

    expect(result).toBe(CodeStatus.DATA_REQUIRED);
  });
});


describe('validateUserNotRegistered', () => {
  it('should return OK when user is not registered', async () => {
    const user = {
      username: 'johndoe',
      email: 'john@example.com'
    };

    jest.spyOn(UserService, "findUserByEmail").mockResolvedValue(null);
    jest.spyOn(UserService, "findUserByUsername").mockResolvedValue(null);

    const result = await UserController.validateUserNotRegistered(user);

    expect(result).toBe(CodeStatus.OK);
    expect(UserService.findUserByEmail).toHaveBeenCalledWith(user.email);
    expect(UserService.findUserByUsername).toHaveBeenCalledWith(user.username);
  });


  it('should return INVALID_DATA when user is already registered', async () => {
    const user = {
      username: 'johndoe',
      email: 'john@example.com'
    };

    jest.spyOn(UserService, "findUserByEmail").mockResolvedValue({ email: user.email });
    jest.spyOn(UserService, "findUserByUsername").mockResolvedValue({ username: user.username });

    const result = await UserController.validateUserNotRegistered(user);

    expect(result).toBe(CodeStatus.INVALID_DATA);
    expect(UserService.findUserByEmail).toHaveBeenCalledWith(user.email);
    expect(UserService.findUserByUsername).toHaveBeenCalledWith(user.username);
  });

});

