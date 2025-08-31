export const validateForm = (formData) => {
    let validationErrorResult = [];
    if (!formData.first_name) {
        validationErrorResult.push("first_name");
    }
    if (!formData.last_name) {
        validationErrorResult.push("last_name");
    }
    if (!formData.date_of_employment) {
        validationErrorResult.push("date_of_employment");
    }
    if (!formData.date_of_birth) {
        validationErrorResult.push("date_of_birth");
    }
    if (!(/^\+90 \(\d{3}\) \d{3} \d{2} \d{2}$/.test(formData.phone))) {
        validationErrorResult.push("phone");
    }
    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))) {
        validationErrorResult.push("email");
    }
    if (!['Analytics', 'Tech'].includes(formData.department)) {
        validationErrorResult.push("department");
    }
    if (!['Junior', 'Medior', 'Senior'].includes(formData.position)) {
        validationErrorResult.push("position");
    }
    return validationErrorResult;
}