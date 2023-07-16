var EmployeeOrgApp = /** @class */ (function () {
    function EmployeeOrgApp(ceo) {
        this.ceo = ceo;
        this.history = [];
    }
    EmployeeOrgApp.prototype.move = function (employeeID, supervisorID) {
        var _a = this.findEmployeeAndSupervisor(employeeID), employee = _a.employee, oldSupervisor = _a.oldSupervisor;
        if (!employee || !oldSupervisor) {
            console.log("Employee with ID ".concat(employeeID, " or supervisor with ID ").concat(supervisorID, " not found."));
            return;
        }
        var newSupervisor = this.findEmployee(supervisorID);
        if (!newSupervisor) {
            console.log("Supervisor with ID ".concat(supervisorID, " not found."));
            return;
        }
        oldSupervisor.subordinates = oldSupervisor.subordinates.filter(function (subordinate) { return subordinate.uniqueId !== employeeID; });
        newSupervisor.subordinates.push(employee);
        this.history.push({
            employeeID: employeeID,
            oldSupervisorID: oldSupervisor.uniqueId,
            newSupervisorID: newSupervisor.uniqueId,
        });
        console.log("Moved employee ".concat(employee.name, " (ID: ").concat(employee.uniqueId, ") to be subordinate of ").concat(newSupervisor.name, " (ID: ").concat(newSupervisor.uniqueId, ")."));
    };
    EmployeeOrgApp.prototype.undo = function () {
        if (this.history.length === 0) {
            console.log('No actions to undo.');
            return;
        }
        var lastAction = this.history.pop();
        if (!lastAction) {
            console.log('Invalid action in history.');
            return;
        }
        var employeeID = lastAction.employeeID, oldSupervisorID = lastAction.oldSupervisorID, newSupervisorID = lastAction.newSupervisorID;
        var _a = this.findEmployeeAndSupervisor(employeeID), employee = _a.employee, oldSupervisor = _a.oldSupervisor;
        if (!employee || !oldSupervisor) {
            console.log('Invalid employee or supervisor in history action.');
            return;
        }
        var newSupervisor = this.findEmployee(newSupervisorID);
        if (!newSupervisor) {
            console.log('Invalid new supervisor in history action.');
            return;
        }
        newSupervisor.subordinates = newSupervisor.subordinates.filter(function (subordinate) { return subordinate.uniqueId !== employeeID; });
        oldSupervisor.subordinates.push(employee);
        console.log("Undid move action: Moved employee ".concat(employee.name, " (ID: ").concat(employee.uniqueId, ") back to be subordinate of ").concat(oldSupervisor.name, " (ID: ").concat(oldSupervisor.uniqueId, ")."));
    };
    EmployeeOrgApp.prototype.redo = function () {
        console.log('Redo functionality not implemented.');
    };
    EmployeeOrgApp.prototype.findEmployee = function (employeeID) {
        var stack = [this.ceo];
        while (stack.length > 0) {
            var currentEmployee = stack.pop();
            if ((currentEmployee === null || currentEmployee === void 0 ? void 0 : currentEmployee.uniqueId) === employeeID) {
                return currentEmployee;
            }
            stack.push.apply(stack, ((currentEmployee === null || currentEmployee === void 0 ? void 0 : currentEmployee.subordinates) || []));
        }
        return undefined;
    };
    EmployeeOrgApp.prototype.findEmployeeAndSupervisor = function (employeeID) {
        var stack = [
            { employee: this.ceo },
        ];
        var _loop_1 = function () {
            var _a = stack.pop(), employee = _a.employee, supervisor = _a.supervisor;
            if (employee.uniqueId === employeeID) {
                return { value: { employee: employee, oldSupervisor: supervisor } };
            }
            stack.push.apply(stack, employee.subordinates.map(function (subordinate) { return ({
                employee: subordinate,
                supervisor: employee,
            }); }));
        };
        while (stack.length > 0) {
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return {};
    };
    return EmployeeOrgApp;
}());
var ceo = {
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
var app = new EmployeeOrgApp(ceo);
app.move(5, 14); // Move Bob Saget to be subordinate of Georgina Flangy
app.undo(); // Undo the last move action
app.redo(); // Redo the last undone action
