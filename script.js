/* Function meant to combine the inputs and generate a useful prompt */
function combineInputs() {
    const description = document.getElementById("description").value;
    const highlights = document.getElementById("highlights").value;
    let prompt = `
                Act as a professional resume and cover letter writer. 

                Create a cover letter based on the following details:
                - Job Description: ${description}
                - Candidate's Highlights: ${highlights}

                Do NOT use placeholders like [Your Name], [Company Name], etc. 
                Instead, fill in realistic details based on the user's input. 
                Provide the output as a completed cover letter ready to send.
                `;

    generatedCV(prompt);
}

/* Async function that makes the API request and returns data needed */
async function generatedCV(promptText) {
    const loader = document.getElementById("loader");
    loader.style.display = "block";

    const GEMINI_KEY = "AIzaSyBYFvNhq_zb5hKjij5QHd1XYgSAc_FSfe0";
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_KEY;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("API response: " + data);
        const output = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response";
        document.getElementById("generatedResult").value = output;

    } catch (error) {
        console.error("Fetch error: ", error);
    } finally {
        loader.style.display = "none";
    }
}

/* Add event listener for when generate button is pushed */
document.getElementById("generate").addEventListener("click", () => {
    combineInputs();
})

/* Query selector to adjust the text area boxes when lot's of text is inserted */
document.querySelectorAll("textarea").forEach(textarea => {
    textarea.addEventListener("input", () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    })
})
