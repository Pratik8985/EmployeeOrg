interface Employee {
    uniqueId: number;
    name: string;
    subordinates: Employee[];
  }
  
  interface IEmployeeOrgApp {
    ceo: Employee;
    move(employeeID: number, supervisorID: number): void;
    undo(): void;
    redo(): void;
  }
  
  class EmployeeOrgApp implements IEmployeeOrgApp {
    private history: { employeeID: number; oldSupervisorID: number; newSupervisorID: number }[];
     ceo: Employee;
  
    constructor(ceo: Employee) {
      this.ceo = ceo;
      this.history = [];
    }
  
    move(employeeID: number, supervisorID: number): void {
      const { employee, oldSupervisor } = this.findEmployeeAndSupervisor(employeeID);
  
      if (!employee || !oldSupervisor) {
        console.log(`Employee with ID ${employeeID} or supervisor with ID ${supervisorID} not found.`);
        return;
      }
  
      const newSupervisor = this.findEmployee(supervisorID);
  
      if (!newSupervisor) {
        console.log(`Supervisor with ID ${supervisorID} not found.`);
        return;
      }
  
      oldSupervisor.subordinates = oldSupervisor.subordinates.filter(
        (subordinate) => subordinate.uniqueId !== employeeID
      );
  
      newSupervisor.subordinates.push(employee);
  
      this.history.push({
        employeeID,
        oldSupervisorID: oldSupervisor.uniqueId,
        newSupervisorID: newSupervisor.uniqueId,
      });
  
      console.log(
        `Moved employee ${employee.name} (ID: ${employee.uniqueId}) to be subordinate of ${newSupervisor.name} (ID: ${newSupervisor.uniqueId}).`
      );
    }
  
    undo(): void {
      if (this.history.length === 0) {
        console.log('No actions to undo.');
        return;
      }
  
      const lastAction = this.history.pop();
  
      if (!lastAction) {
        console.log('Invalid action in history.');
        return;
      }
  
      const { employeeID, oldSupervisorID, newSupervisorID } = lastAction;
  
      const { employee, oldSupervisor } = this.findEmployeeAndSupervisor(employeeID);
  
      if (!employee || !oldSupervisor) {
        console.log('Invalid employee or supervisor in history action.');
        return;
      }
  
      const newSupervisor = this.findEmployee(newSupervisorID);
  
      if (!newSupervisor) {
        console.log('Invalid new supervisor in history action.');
        return;
      }
  
      newSupervisor.subordinates = newSupervisor.subordinates.filter(
        (subordinate) => subordinate.uniqueId !== employeeID
      );
  
      oldSupervisor.subordinates.push(employee);
  
      console.log(
        `Undid move action: Moved employee ${employee.name} (ID: ${employee.uniqueId}) back to be subordinate of ${oldSupervisor.name} (ID: ${oldSupervisor.uniqueId}).`
      );
    }
  
    redo(): void {
      console.log('Redo functionality not implemented.');
    }
  
    private findEmployee(employeeID: number): Employee | undefined {
      const stack: Employee[] = [this.ceo];
  
      while (stack.length > 0) {
        const currentEmployee = stack.pop();
  
        if (currentEmployee?.uniqueId === employeeID) {
          return currentEmployee;
        }
  
        stack.push(...(currentEmployee?.subordinates || []));
      }
  
      return undefined;
    }
  
    private findEmployeeAndSupervisor(
      employeeID: number
    ): { employee?: Employee; oldSupervisor?: Employee } {
      const stack: { employee: Employee; supervisor?: Employee }[] = [
        { employee: this.ceo },
      ];
  
      while (stack.length > 0) {
        const { employee, supervisor } = stack.pop()!;
  
        if (employee.uniqueId === employeeID) {
          return { employee, oldSupervisor: supervisor };
        }
  
        stack.push(
          ...employee.subordinates.map((subordinate) => ({
            employee: subordinate,
            supervisor: employee,
          }))
        );
      }
  
      return {};
    }
  }
  
  const ceo: Employee = {
    uniqueId: 1,
    name: 'John Smith',
    subordinates: [
      {
        uniqueId: 2,
        name: 'Margot Donald',
        subordinates: [
          { uniqueId: 3, name: 'Cassandra Reynolds', subordinates: [] },
          { uniqueId: 4, name: 'Mary Blue', subordinates: [] },
          { uniqueId: 5, name: 'Bob Saget', subordinates: [] },
          { uniqueId: 6, name: 'Tina Teff', subordinates: [] },
          { uniqueId: 7, name: 'Will Turner', subordinates: [] },
        ],
      },
      {
        uniqueId: 8,
        name: 'Tyler Simpson',
        subordinates: [
          { uniqueId: 9, name: 'Harry Tobs', subordinates: [] },
          { uniqueId: 10, name: 'Thomas Brown', subordinates: [] },
          { uniqueId: 11, name: 'George Carrey', subordinates: [] },
          { uniqueId: 12, name: 'Gary Styles', subordinates: [] },
        ],
      },
      {
        uniqueId: 13,
        name: 'Ben Willis',
        subordinates: [
          { uniqueId: 14, name: 'Georgina Flangy', subordinates: [] },
          { uniqueId: 15, name: 'Sophie Turner', subordinates: [] },
        ],
      },
    ],
  };
  
  const app = new EmployeeOrgApp(ceo);
  
  app.move(5, 14); // Move Bob Saget to be subordinate of Georgina Flangy
  app.undo(); // Undo the last move action
  app.redo(); // Redo the last undone action
  