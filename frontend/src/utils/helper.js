import M from 'materialize-css';

//when visit new window using history.push if came back previous window then initialization does not works
export const initAllModal = () => {
    let elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
}

export const initModalAndOpen = (modalId) => {
    let Modalelem = document.querySelector(modalId);
    let instance = M.Modal.init(Modalelem);
    instance.open();
}

export const prepareActivityHelper = (responseData) => {
    let allActivities = [];
    if(responseData) {
        responseData.bugs.map(bug => {
            allActivities.push({
                time: bug.time,
                user: bug.user.username,
                text: bug.text,
                type: 'bug'
            })
            if(bug.fixedAt) {
                allActivities.push({
                    time: bug.fixedAt,
                    user: bug.user.username,
                    text: bug.text,
                    type: 'bug-fixed'
                })
            }
        });
        responseData.todos.map(todo => {
            allActivities.push({
                time: todo.time,
                user: todo.user.username,
                text: todo.text,
                type: 'todo'
            })
            if(todo.doneAt) {
                allActivities.push({
                    time: todo.doneAt,
                    user: todo.user.username,
                    text: todo.text,
                    type: 'todo-done'
                })
            }
        })
    }

    allActivities.sort(function(a,b){
        return new Date(b.time) - new Date(a.time);
    });
    const modifiedActivities = []; //Grouping discussion, bug, todo by date
    let currentDate = null, previousDate = null;
    let sameDateActivities = [];

    allActivities.map(activity => {
        currentDate = new Date(activity.time).getDate() + '/' + new Date(activity.time).getMonth() + '/' + new Date(activity.time).getFullYear();
        if(currentDate === previousDate) sameDateActivities.unshift(activity)
        else {
            previousDate = currentDate;
            modifiedActivities.unshift(sameDateActivities);
            sameDateActivities = [];
            sameDateActivities.unshift(activity);
        }
    })
    if(sameDateActivities.length > 0)
        modifiedActivities.unshift(sameDateActivities);
    let lastArray = []; //As we using unshift most recent date will be at last reversing this and add to lastArray
    for(let i = 0; i < modifiedActivities.length - 1; i++) {
        lastArray.unshift(modifiedActivities[i]);
    }

    //key:data => value(all bug fixed/todo finished and bug appears and todo add at that day)
    return lastArray;
}

export const getUserRoleString = (role) => {
    if(role === '1') return 'CEO';
    if(role === '2') return 'Project Manger';
    if(role === '3') return 'Team Leader';
    if(role === '4') return 'Senior Software Developer';
    if(role === '5') return 'Software Developer';
    if(role === '6') return 'Junior Software Developer';
    if(role === '7') return 'Intern';
}
