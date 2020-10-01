import React from 'react';

import './DiscussionRow.css';

const DiscussionRow = ({ discussion }) => {
    return (
        <div className="row white discussion_row">
            <div className="col s1 ">
                <img
                    src={discussion?.user?.profileImage?.imageUrl}
                    alt=" "
                    className="avatar "
                />
            </div>
            <div className="col s11 discussion">
                <p>{discussion.text}</p>
                <p>by <span> {discussion.user.username}</span></p>
            </div>
            {/*<div className="col s1 comment_count">*/}
            {/*    <p><span>0 comment</span></p>*/}
            {/*</div>*/}
        </div>
    )
}

export default DiscussionRow;
