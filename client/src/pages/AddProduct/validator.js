const validateForm = (name, description, url) => {
    if(!(name && description && url)) {
        return 'Invalid data';
    }
    if (!(url.startsWith('http') || url.startsWith('https')) || url < 10) {
        return 'Invalid URL!';
    }
    if (description.length < 35 || description.length > 100) {
        return 'Description should be between 35 and 100 characters!';
    }
    if (name.length < 4 || name.length > 30) {
        return 'Name should be between 4 and 30 characters!';
    }    

    return '';
}

export default validateForm;