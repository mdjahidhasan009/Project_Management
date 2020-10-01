import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';


import { getGithubRepos } from "../../actions/profile";

const ProfileGithub = ({ username, getGithubRepos, repos }) => {
    useEffect(() => {
        getGithubRepos(username);
    }, []);

    return (
        <div className="profile-github">
            <h2 className="text-primary my-1">Github Repos</h2>
            {repos === null ? (
                <Spinner />
            ) : (
                repos.map(repo => (
                    <div key={repo._id} className='repo bg-white p-1 my-1'>
                        <div>
                            <h4>
                                <a
                                    href={repo.html_url}
                                    target='_blank'
                                    rel='noopener noreference'
                                >
                                    {repo.name}
                                </a>
                            </h4>
                            <p>{repo.description}</p>
                        </div>
                        <div>
                            <ul><li className="badge badge-primary">Stars: {repo.stargazers_count}</li></ul>
                            <ul><li className="badge badge-dark">Stars: {repo.watcher_count}</li></ul>
                            <ul><li className="badge badge-light">Stars: {repo.forks_count}</li></ul>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
};

ProfileGithub.prototypes = {
    username: PropTypes.string.isRequired,
    getGithubRepos: PropTypes.func.isRequired,
    repos: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
   repos: state.profile.repos
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);