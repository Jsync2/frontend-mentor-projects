// DOM Elements
const elements = {
    radio: {
        metric: document.querySelector('input[name="unit"][value="metric"]'),
        imperial: document.querySelector('input[name="unit"][value="imperial"]')
    },
    display: {
        output: document.querySelector('output .result-container h2'),
        classification: document.querySelector('#result'),
        description: document.querySelector('#classification')
    },
    metric: {
        container: document.querySelector('#metric'),
        height: document.querySelector("#height"),
        weight: document.querySelector("#weight")
    },
    imperial: {
        container: document.querySelector('#imperial'),
        feet: document.querySelector('#feet'),
        inches: document.querySelector('#inches'),
        stones: document.querySelector('#st'),
        pounds: document.querySelector('#pounds')
    }
};

// BMI Classification ranges
const BMI_RANGES = {
    UNDERWEIGHT: { max: 18.5, class: 'Underweight', message: 'Consider eating more and focusing on healthy weight gain.' },
    HEALTHY: { min: 18.5, max: 25, class: 'Healthy weight' },
    OVERWEIGHT: { min: 25, max: 30, class: 'Overweight', message: 'Consider losing some weight to improve your health.' },
    OBESE: { min: 30, class: 'Obese', message: 'You are above the healthy range. Consider adjusting diet and exercise' }
};

// Handle unit system display
function toggleUnitSystem() {
    const isMetric = elements.radio.metric.checked;
    elements.metric.container.style.display = isMetric ? "flex" : "none";
    elements.imperial.container.style.display = isMetric ? "none" : "flex" ;
    Object.keys(elements.imperial).forEach(key => {
        if (key !== 'container'){
            elements.imperial[key].value = '';}
    });
    Object.keys(elements.metric).forEach(key => {
        if (key !== 'container'){
            elements.metric[key].value = '';
        }
    })
    displayWelcomeMessage();
}

// Calculate BMI and update display
function calculateBmi() {
    const height = parseFloat(elements.metric.height.value);
    const weight = parseFloat(elements.metric.weight.value);

    const feet = parseFloat(elements.imperial.feet.value);
    const inches = parseFloat(elements.imperial.inches.value);
    const stones = parseFloat(elements.imperial.stones.value);
    const pounds = parseFloat(elements.imperial.pounds.value);

    let weightInPounds = (stones * 14) + pounds;
    let heightInInches = (feet * 12) + inches;

    let bmi = 0;
    let classification = '';

    if (feet || inches || stones || pounds) {
        bmi = calculateImperialBMI(heightInInches, weightInPounds);
        classification = getBMIClassification(bmi);
        displayBMIResults(bmi, classification);
    }else if(height || weight){
        bmi = calculateMetricBMI(height, weight);
        classification = getBMIClassification(bmi);
        displayBMIResults(bmi, classification);
    }else{
        displayWelcomeMessage();
        return;
    }
}

function calculateImperialBMI(heightInInches, weightInPounds) {
    weightInPounds = weightInPounds * 703;
    heightInInches = heightInInches * heightInInches;
    return weightInPounds / heightInInches;
}
function calculateMetricBMI(height, weight) {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}

function getBMIClassification(bmi) {
    if (bmi < BMI_RANGES.UNDERWEIGHT.max) return BMI_RANGES.UNDERWEIGHT;
    if (bmi < BMI_RANGES.HEALTHY.max) return BMI_RANGES.HEALTHY;
    if (bmi < BMI_RANGES.OVERWEIGHT.max) return BMI_RANGES.OVERWEIGHT;
    return BMI_RANGES.OBESE;
}

function displayWelcomeMessage() {
    elements.display.classification.innerHTML = "Welcome!";
    elements.display.classification.style.fontSize = "2rem";
    elements.display.output.innerHTML = "Enter your height and weight and you'll see your BMI here.";
    elements.display.output.style.fontSize = "1rem";
    elements.display.output.style.fontWeight = "normal";
    elements.display.description.style.display = "none";
}

function displayBMIResults(bmi, classification) {
    elements.display.classification.innerHTML = "Your BMI is...";
    elements.display.classification.style.fontSize = "1rem";
    elements.display.output.innerHTML = bmi.toFixed(1);
    elements.display.output.style.fontSize = "3rem";
    elements.display.output.style.fontWeight = "bold";
    elements.display.description.style.display = "block";

    if (classification === BMI_RANGES.HEALTHY) {
        const inch = 0.0254;
        let heightInMeters = 0;
        let idealWeightRange = 0;
        if (elements.radio.metric.checked) {
            heightInMeters = parseFloat(elements.metric.height.value) / 100;
            idealWeightRange = getIdealWeightRange(heightInMeters);
            elements.display.description.innerHTML = `Your BMI suggests you're a ${classification.class}. 
            Your ideal weight is between <strong>${idealWeightRange.min.toFixed(1)}kg and ${idealWeightRange.max.toFixed(1)}kg</strong>`;
        }else if(elements.radio.imperial.checked){
            heightInMeters = (parseFloat(elements.imperial.feet.value) * 12 + parseFloat(elements.imperial.inches.value)) * inch;
            idealWeightRange = getIdealWeightRange(heightInMeters);
            elements.display.description.innerHTML = `Your BMI suggests you're a ${classification.class}. 
            Your ideal weight is between <strong>${idealWeightRange.min.toFixed(1)}kg and ${idealWeightRange.max.toFixed(1)}kg</strong>`;
        }
    }else{
        elements.display.description.innerHTML = `Your BMI suggests you're a ${classification.class}. ${classification.message}`;
    }
}

function getIdealWeightRange(heightInMeters) {
    const heightSquared = heightInMeters * heightInMeters;
    return {
        min: heightSquared * BMI_RANGES.HEALTHY.min,
        max: heightSquared * BMI_RANGES.HEALTHY.max
    };
}

// Event Listeners
elements.radio.metric.addEventListener('change', toggleUnitSystem);
elements.radio.imperial.addEventListener('change', toggleUnitSystem);
elements.metric.height.addEventListener("input", calculateBmi);
elements.metric.weight.addEventListener("input", calculateBmi);
elements.imperial.feet.addEventListener("input", calculateBmi);
elements.imperial.inches.addEventListener("input", calculateBmi);
elements.imperial.stones.addEventListener("input", calculateBmi);
elements.imperial.pounds.addEventListener("input", calculateBmi);

// Initialize
toggleUnitSystem();
calculateBmi();