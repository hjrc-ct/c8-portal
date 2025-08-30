import React from 'react';

const CoursePart = ({ title, content, imageUrl }) => {
    return (
        <div className="course-part">
            <h2>{title}</h2>
            <img src={imageUrl} alt={title} />
            <p>{content}</p>
        </div>
    );
};

export default CoursePart;