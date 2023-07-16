# EmployeeOrg
Run the following command to install the project dependencies:
**npm install**
After the dependencies are installed, you can run the project using the following command:
**npm start**
This command will compile the TypeScript code, start the application, and provide you with a local server URL

## Usage

1. Instantiate the `EmployeeOrgApp` class with the CEO as the constructor parameter:
```typescript
import { EmployeeOrgApp } from './dist/EmployeeOrgApp';
import { ceo } from './dist/data';

const app = new EmployeeOrgApp(ceo);
Move an employee to become the subordinate of another employee:
**app.move(employeeID, supervisorID);**
Undo the last move action:
**app.undo();**
Redo the last undone action:
**app.redo();**

The project structure is as follows:

- `index.ts`: The entry point of the application.
- `EmployeeOrgApp.ts`: The implementation of the `EmployeeOrgApp` class.
- `tsconfig.json`: TypeScript compiler configuration file.
- `out/`: Contains the compiled JavaScript files.
