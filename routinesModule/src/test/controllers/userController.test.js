const UserService = require('../../services/userServices');
const UserController = require('../../controllers/usersController');
const CodeStatus = require('../../models/codeStatus');


describe('test for usersController', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('Return all users', async () => {
        const req = {};
        const res = {
            json: jest.fn(),
        };

        const users = [
            { id: 1, name: 'John Doe', email: 'johndoe@example.com' },
            { id: 2, name: 'Jane Doe', email: 'janedoe@example.com' },
        ];

        jest.spyOn(UserService, 'getAllDataUsers').mockResolvedValue(users);

        await UserController.getAllUsers(req, res);

        expect(res.json).toHaveBeenCalledWith(users);
    });


    it('should return an error message if there is an error in getAllDataUsers', async () => {
        const req = {};
        const res = {
            json: jest.fn(),
        };

        const error = new Error('Database connection failed');
        jest.spyOn(UserService, 'getAllDataUsers').mockRejectedValue(error);

        await UserController.getAllUsers(req, res);

        expect(res.json).toHaveBeenCalledWith({
            error: CodeStatus.INVALID_DATA,
            msg: "Upss there is an error..."
        });
    });

    it("should return user witch username given at getUserByUsername", async () => {
        const req = {
            params:{
                username: 'J1000'
            } 
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const user = {
            id: 1,
            name: 'John Doe',
            lastname: "Morales",
            email: 'johndoe@example.com',
            username: "J1000"
        };

        jest.spyOn(UserService, "getUserByUsername").mockResolvedValue(user);

        await UserController.userByUsername(req, res);

        expect(res.status).toHaveBeenCalledWith(CodeStatus.OK);
        expect(res.json).toHaveBeenCalledWith(user);
    });


    it('should return an error message if the user is not found at getUserByUsername', async () => {
        const req = {
          params: {
            username: 'johndoe'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn()
        };
        jest.spyOn(UserService, 'getUserByUsername').mockResolvedValue(null);
    
        await UserController.userByUsername(req, res);
    
        expect(res.status).toHaveBeenCalledWith(CodeStatus.INVALID_DATA);
        expect(res.send).toHaveBeenCalledWith({ message: 'User not found' });
    });


    it('should return an error message if there is an error at getUserByUsername', async () => {
        const req = {
          params: {
            username: 'johndoe'
          }
        };

        const res = {
          json: jest.fn()
        };

        const error = new Error('Database connection failed');
        jest.spyOn(UserService, 'getUserByUsername').mockRejectedValue(error);
    
        await UserController.userByUsername(req, res);
    
        expect(res.json).toHaveBeenCalledWith({
          error: CodeStatus.INVALID_DATA,
          msg: "Upss there is an error..."
        });
      });

});
