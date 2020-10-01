import React, {useEffect} from 'react';
import { useParams } from 'react-router-dom';


import './Discussion.css';
import Input from "../shared/FormElements/Input";
import {VALIDATOR_REQUIRE} from "../../utils/validators";
import {useForm} from "../../hooks/form-hook";
import {useHttpClient} from "../../hooks/http-hook";
import {connect} from 'react-redux';
import {addDiscussion} from "../../actions/project-action";
import DiscussionRow from "./DiscussionRow";

const Discussion = ( { project, addDiscussion }) => {

    const { isLoading, error, sendRequest , clearError} = useHttpClient();
    const projectId = useParams().projectId;

    const [ formState, inputHandler ] = useForm(
        {
            discussionText: {
                value: '',
                isValid: false
            }
        },
        false
    );

    const addDiscussionHandler = async (event) => {
        event.preventDefault();
        try {
            await addDiscussion(formState.inputs.discussionText.value, projectId, sendRequest);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="row">
            <button data-target="modal2" className="light-blue lighten-1 modal-trigger">
                <i className="fas fa-plus-circle"></i>      ADD NEW DISCUSSION
                {/*<i className="material-icons add_project_btn">add_circle_outline</i>*/}

            </button>
            <div id="modal2" className="modal">
                <div className="modal-content">
                    <h5>Add New Discussion</h5>
                    <Input
                        element="input"
                        elementTitle="discussionText"
                        type="text"
                        placeholder="Enter Discussion"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter discussion text."
                        onInput={inputHandler}
                    />
                </div>
                <div className="modal-footer">
                    <button disabled={!formState.isValid} onClick={addDiscussionHandler} className="modal-close waves-effect waves-green btn-flat">Add New Project</button>
                </div>
            </div>

            <h5>Discussion List</h5>
            {project && project.discussion.map(discussion => (
                <DiscussionRow key={discussion._id} discussion={discussion}/>
                ))
            }
        </div>
    )
}

const mapStateToProps = state => ({
    project: state.project.project
});

// export default Discussion;
export default connect(mapStateToProps, { addDiscussion })(Discussion);
