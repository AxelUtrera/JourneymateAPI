const UserService = require('../../services/userServices');
const UserController = require('../../controllers/usersController');
const CodeStatus = require('../../models/codeStatus');
const Logger = require('../../config/logger')


describe('test for usersController', () => {

    it('Return all users    ', async () => {
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
});
