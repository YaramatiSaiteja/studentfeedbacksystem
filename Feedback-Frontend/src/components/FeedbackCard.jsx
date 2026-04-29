import React from 'react';
import { FaStar, FaUserTie } from 'react-icons/fa';

const FeedbackCard = ({ feedback }) => {
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <FaStar key={i} color={i < rating ? '#ffc107' : '#e4e5e9'} className="me-1" />
        ));
    };

    return (
        <div className="card shadow-sm border-0 mb-3 hover-effect">
            <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted d-flex justify-content-between align-items-center">
                    <span>Student ID: ******{feedback.studentId.substring(feedback.studentId.length - 4)}</span>
                    <small>{new Date(feedback.submittedAt).toLocaleDateString()}</small>
                </h6>

                <div className="row mt-3 mb-2 g-3">
                    <div className="col-md-6 mb-2 mb-md-0">
                        <div className="d-flex align-items-center">
                            <strong className="me-2 text-dark" style={{ width: '140px' }}>Course Rating:</strong>
                            <div>{renderStars(feedback.courseRating)}</div>
                            <span className="ms-2 badge bg-primary bg-opacity-10 text-primary rounded-pill">{feedback.courseRating}/5</span>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex align-items-center">
                            <strong className="me-2 text-dark" style={{ width: '140px' }}><FaUserTie className="me-1 text-muted" />Instructor:</strong>
                            <div>{renderStars(feedback.instructorRating)}</div>
                            <span className="ms-2 badge bg-info bg-opacity-10 text-info rounded-pill">{feedback.instructorRating}/5</span>
                        </div>
                    </div>

                    {/* Detailed Insights */}
                    {feedback.contentQuality && (
                        <div className="col-md-6 mb-2 mb-md-0 d-flex align-items-center">
                            <strong className="me-2 text-dark small" style={{ width: '140px' }}>Content Quality:</strong>
                            <div>{renderStars(feedback.contentQuality)}</div>
                        </div>
                    )}
                    {feedback.practicalApplication && (
                        <div className="col-md-6 d-flex align-items-center">
                            <strong className="me-2 text-dark small" style={{ width: '140px' }}>Practical App:</strong>
                            <div>{renderStars(feedback.practicalApplication)}</div>
                        </div>
                    )}
                    {feedback.subjectDifficulty && (
                        <div className="col-md-12 mt-2 d-flex align-items-center">
                            <strong className="me-2 text-dark small" style={{ width: '140px' }}>Subject Difficulty:</strong>
                            <div>{renderStars(feedback.subjectDifficulty)}</div>
                            <span className="ms-2 badge bg-warning bg-opacity-10 text-warning rounded-pill">{feedback.subjectDifficulty}/5</span>
                        </div>
                    )}
                </div>

                {feedback.comment && (
                    <div className="mt-3 p-3 bg-light rounded text-dark">
                        <p className="mb-0 fst-italic">"{feedback.comment}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackCard;
