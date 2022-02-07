//Add new project
import M from "materialize-css";
import {ADD_PROJECT, GET_PROJECTS} from "./types";

export const addProject = (projectName, projectCategory, projectDescription, projectDeadline, method) => async dispatch =>{
  try {
    const responseData = await method(
        process.env.REACT_APP_ASSET_URL +'/api/project',
        'POST',
        JSON.stringify({
          name: projectName,
          category: projectCategory,
          description: projectDescription,
          deadline: projectDeadline
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.token
        }
    )
    M.toast({html: 'New Project Added', classes: 'green'});
    dispatch({
      type: ADD_PROJECT,
      payload: responseData
    })
  } catch(error) {
    console.error(error);
  }
}

//Get all projects
export const getAllProjects = (method) => async dispatch => {
  try {
    const responseData = await method(
        process.env.REACT_APP_ASSET_URL +'/api/project',
        'GET',
        null,
        {
          Authorization: 'Bearer ' + localStorage.token
        }
    );
    dispatch({
      type: GET_PROJECTS,
      payload: responseData
    });
  } catch (error) {
    console.error(error);
  }
}
