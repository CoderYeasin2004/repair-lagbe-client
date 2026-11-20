import React from 'react';

const ServiceDetailsPage = ({params}: {params: {details: string}}) => {

    const { details } = params;
    console.log('Service ID:', details); // Log the service ID to the console
    return (
        <div>
            Service Details page content goes here.
        </div>
    );
};

export default ServiceDetailsPage;