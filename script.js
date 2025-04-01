// script.js (v6 - Random Lawyer Name - Official Look)

document.addEventListener('DOMContentLoaded', () => {
    console.log("[Init] DOM fully loaded and parsed.");

    // --- Get DOM Elements ---
    const form = document.getElementById('sue-form');
    const defendantNameInput = document.getElementById('defendant-name');
    const chargeSelect = document.getElementById('charge');
    const evidenceUpload = document.getElementById('evidence-upload');
    const evidenceCanvas = document.getElementById('evidence-canvas');
    const canvasPlaceholder = document.getElementById('canvas-placeholder');
    const generatePreviewButton = document.getElementById('generate-preview-button');
    const lawsuitDisplay = document.getElementById('lawsuit-display');
    const fakePdfDiv = document.getElementById('fake-pdf');
    const emailSection = document.getElementById('email-section');
    const recipientEmailInput = document.getElementById('recipient-email');
    const sendEmailButton = document.getElementById('send-email-button');
    const emailStatus = document.getElementById('email-status');
    const aprilFoolsModal = document.getElementById('april-fools-modal');
    const closeModalButton = document.querySelector('.close-button');

    // Basic check for element existence
    let elementsFound = true;
    const essentialElements = {
        form, defendantNameInput, chargeSelect, generatePreviewButton, lawsuitDisplay,
        fakePdfDiv, emailSection, recipientEmailInput, sendEmailButton, emailStatus, aprilFoolsModal
    };
    for (const key in essentialElements) {
        if (!essentialElements[key]) {
            console.error(`[Init] ERROR: Element with ID '${key}' not found!`);
            elementsFound = false;
        }
    }
    if (elementsFound) {
        console.log("[Init] All essential DOM elements seem to be present.");
    } else {
        console.error("[Init] Halting script due to missing elements.");
        return; // Stop if critical elements are missing
    }

    let ctx = null;
    try {
        if (evidenceCanvas) {
            ctx = evidenceCanvas.getContext('2d');
            console.log("[Init] Canvas context obtained.");
        } else {
            console.warn("[Init] Evidence canvas element not found.");
        }
    } catch (e) {
        console.error("[Init] Error getting canvas context:", e);
    }

    let uploadedImage = null;

    // --- Event Listeners ---

    // Handle image upload (No changes needed here for the button issue)
    if (evidenceUpload) {
        evidenceUpload.addEventListener('change', (event) => {
            // (Image handling code - unchanged)
            console.log("[Image] File input changed.");
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    uploadedImage = new Image();
                    uploadedImage.onload = () => {
                        console.log("[Image] Image loaded.");
                        if (evidenceCanvas && canvasPlaceholder) {
                            evidenceCanvas.classList.remove('hidden');
                            canvasPlaceholder.classList.remove('hidden');
                            drawImageAndWatermarks();
                        } else { console.error("[Image] Canvas or placeholder missing."); }
                    };
                    uploadedImage.onerror = () => { console.error("[Image] Error loading image data."); alert("Failed to load image."); resetCanvas(); };
                    uploadedImage.src = e.target.result;
                };
                reader.onerror = () => { console.error("[Image] Error reading file."); alert("Failed to read file."); resetCanvas(); };
                reader.readAsDataURL(file);
            } else { console.log("[Image] No valid image file selected."); resetCanvas(); uploadedImage = null; }
        });
    }

    // --- Generate Preview Button Click Handler ---
    if (generatePreviewButton) {
        generatePreviewButton.addEventListener('click', () => {
            console.log("[Preview Button] Click detected.");

            // 1. Get Input Values
            const defendantName = defendantNameInput.value.trim();
            const charge = chargeSelect.value;
            console.log(`[Preview Button] Values - Defendant: '${defendantName}', Charge: '${charge}'`);

            // 2. Validation
            if (!defendantName || !charge) {
                console.warn("[Preview Button] Validation FAILED: Name or charge is empty.");
                alert("Please fill in the defendant's name and select a charge.");
                // Ensure function stops here if validation fails
                console.log("[Preview Button] Halting execution due to validation failure.");
                return;
            }
            console.log("[Preview Button] Validation PASSED.");

            try {
                console.log("[Preview Button] Entering 'try' block for generation and display...");

                // 3. Generate Lawsuit Content
                console.log("[Preview Button] Calling generateFakeLawsuit...");
                generateFakeLawsuit(defendantName, charge);
                // Check if content was actually added
                if (fakePdfDiv.innerHTML.length > 0) {
                    console.log(`[Preview Button] generateFakeLawsuit finished. fakePdfDiv innerHTML length: ${fakePdfDiv.innerHTML.length}`);
                } else {
                    console.error("[Preview Button] generateFakeLawsuit finished, but fakePdfDiv is empty!");
                }


                // 4. Make Sections Visible
                console.log(`[Preview Button] Before visibility change - lawsuitDisplay hidden: ${lawsuitDisplay.classList.contains('hidden')}, emailSection hidden: ${emailSection.classList.contains('hidden')}`);
                lawsuitDisplay.classList.remove('hidden');
                emailSection.classList.remove('hidden');
                console.log(`[Preview Button] After visibility change - lawsuitDisplay hidden: ${lawsuitDisplay.classList.contains('hidden')}, emailSection hidden: ${emailSection.classList.contains('hidden')}`);

                // Check computed style just in case
                const lawsuitDisplayStyle = window.getComputedStyle(lawsuitDisplay).display;
                const emailSectionStyle = window.getComputedStyle(emailSection).display;
                console.log(`[Preview Button] Computed display styles - lawsuitDisplay: ${lawsuitDisplayStyle}, emailSection: ${emailSectionStyle}`);
                if (lawsuitDisplayStyle === 'none' || emailSectionStyle === 'none') {
                    console.warn("[Preview Button] Warning: An element's computed style is still 'none' after removing 'hidden' class. Check CSS conflicts.");
                }


                // 5. Clear Status
                if (emailStatus) {
                    emailStatus.textContent = '';
                    console.log("[Preview Button] Email status cleared.");
                }

                // 6. Scroll into View
                console.log("[Preview Button] Attempting to scroll lawsuitDisplay into view...");
                lawsuitDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); // Changed block to 'nearest' as a test
                console.log("[Preview Button] scrollIntoView called.");

                console.log("[Preview Button] Preview generation process complete.");

            } catch (error) {
                console.error("[Preview Button] CRITICAL ERROR during preview generation:", error);
                alert("An unexpected error occurred while generating the preview. Check the console (F12) for details.");
            }
        });
        console.log("[Init] 'Generate Preview' button click listener attached.");
    } else {
        console.error("[Init] ERROR: Generate Preview Button element not found. Cannot attach click listener.");
    }

    // --- Send Email Button Click Handler --- (Unchanged)
    if (sendEmailButton) {
        sendEmailButton.addEventListener('click', () => {
            console.log("[Send Button] Click detected.");
            const recipientEmail = recipientEmailInput.value.trim();
            console.log(`[Send Button] Recipient Email: '${recipientEmail}'`);

            if (!recipientEmail || !/^\S+@\S+\.\S+$/.test(recipientEmail)) {
                console.warn("[Send Button] Invalid email entered.");
                alert("Please enter a valid email address for the recipient.");
                return;
            }
            console.log("[Send Button] Email validation passed. Simulating send...");

            if (emailStatus) {
                emailStatus.textContent = 'Sending...';
                emailStatus.classList.remove('text-green-400');
                emailStatus.classList.add('text-amber-400');
            }
            sendEmailButton.disabled = true;
            sendEmailButton.classList.add('opacity-50', 'cursor-not-allowed');

            setTimeout(() => {
                if (emailStatus) {
                    emailStatus.textContent = '✅ Lawsuit Sent!'; // Slightly more official message
                    emailStatus.classList.remove('text-amber-400');
                    emailStatus.classList.add('text-green-400');
                }
                console.log("[Send Button] Fake send complete.");

                setTimeout(() => {
                    revealAprilFools();
                    console.log("[Send Button] April Fools reveal triggered!");
                    sendEmailButton.disabled = false;
                    sendEmailButton.classList.remove('opacity-50', 'cursor-not-allowed');
                }, 500);

            }, 2000);
        });
        console.log("[Init] 'Send Email' button click listener attached.");
    } else {
        console.error("[Init] ERROR: Send Email button element not found.");
    }

    // --- Modal Close Handlers --- (Unchanged)
     if (closeModalButton) {
         closeModalButton.addEventListener('click', () => {
             if (aprilFoolsModal) {
                 aprilFoolsModal.style.display = 'none';
                 console.log("[Modal] Closed via close button.");
             }
         });
     }
     window.addEventListener('click', (event) => {
         if (aprilFoolsModal && event.target === aprilFoolsModal) {
             aprilFoolsModal.style.display = 'none';
             console.log("[Modal] Closed via background click.");
         }
     });
     console.log("[Init] Modal listeners attached.");


    // --- Helper Functions --- (Unchanged)

    function resetCanvas() {
        if (evidenceCanvas && ctx && canvasPlaceholder) {
            evidenceCanvas.classList.add('hidden');
            canvasPlaceholder.classList.add('hidden');
            ctx.clearRect(0, 0, evidenceCanvas.width, evidenceCanvas.height);
        }
        uploadedImage = null;
    }

    function drawImageAndWatermarks() {
        // (Function content unchanged)
        if (!uploadedImage || !ctx || !evidenceCanvas) return;
        if (evidenceCanvas.clientWidth === 0) { setTimeout(drawImageAndWatermarks, 100); return; }
        const maxWidth = evidenceCanvas.clientWidth;
        const scale = Math.min(maxWidth / uploadedImage.width, 1);
        const canvasHeight = uploadedImage.height * scale;
        evidenceCanvas.width = maxWidth; evidenceCanvas.height = canvasHeight;
        ctx.clearRect(0, 0, evidenceCanvas.width, evidenceCanvas.height);
        ctx.drawImage(uploadedImage, 0, 0, evidenceCanvas.width, evidenceCanvas.height);
        const caseNumber = `CASE #${Math.floor(Math.random() * 90000) + 10000}`;
        const sealText = "GLOBAL SUPREME COURT";
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; ctx.font = 'bold 24px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.save(); ctx.translate(80, 30); ctx.rotate(-0.2); ctx.fillText(caseNumber, 0, 0); ctx.restore();
        ctx.font = 'bold 48px Impact, sans-serif'; ctx.fillStyle = 'rgba(200, 0, 0, 0.4)'; ctx.fillText("EVIDENCE", evidenceCanvas.width / 2, evidenceCanvas.height / 2);
        ctx.fillStyle = 'rgba(200, 200, 0, 0.5)'; ctx.beginPath(); ctx.arc(evidenceCanvas.width - 60, evidenceCanvas.height - 50, 40, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'; ctx.font = 'bold 10px Arial'; ctx.fillText(sealText, evidenceCanvas.width - 60, evidenceCanvas.height - 55); ctx.fillText("OF INSTANT JUSTICE", evidenceCanvas.width - 60, evidenceCanvas.height - 45);
        console.log("[Helper] Watermarks added to canvas.");
    }

    function generateLawyerName() {
        const firstNames = ["A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "I.", "J.", "K.", "L.", "M.", "N.", "O.", "P.", "Q.", "R.", "S.", "T.", "U.", "V.", "W.", "X.", "Y.", "Z.", "Atticus", "Brenda", "Clarence", "Diane", "Elliot", "Fiona", "Geraldine", "Harold", "Ingrid", "Javier", "Kimberly", "Lionel", "Meredith", "Nathan", "Olivia", "Quentin", "Rebecca", "Samuel", "Theresa", "Ulysses", "Veronica", "Walter", "Xavier", "Yvette", "Zachary"];
        const lastNames = ["Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright"];
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const suffix = Math.random() < 0.5 ? "" : ", Esq.";
        return `${firstName} ${lastName}${suffix}`;
    }

    function generateFakeLawsuit(defendant, charge) {
        if (!fakePdfDiv) { console.error("[Helper] Cannot generate fake lawsuit: fakePdfDiv element not found."); return; }
        const caseId = `GSCIJ-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const safeDefendant = defendant || 'Unnamed Party';
        const safeCharge = charge || 'General Malfeasance';
        const lawyerName = generateLawyerName();

        fakePdfDiv.innerHTML = `
            <div style="text-align: center; margin-bottom: 1em;">
                <h3 style="font-size: 1.6em; font-weight: bold;">IN THE GLOBAL SUPREME COURT OF INSTANT JUSTICE</h3>
                <p style="font-size: 1.2em;">Case No: ${caseId}</p>
            </div>
            <div style="margin-bottom: 1.5em;">
                <p><strong>Plaintiff:</strong> Aggrieved Party (Represented by ${lawyerName})</p>
                <p><strong>Defendant:</strong> ${safeDefendant}</p>
            </div>
            <div style="margin-bottom: 1em;">
                <h4 style="font-weight: bold;">COMPLAINT FOR IMMEDIATE RELIEF</h4>
            </div>
            <div style="margin-bottom: 1em;">
                <p><strong>JURISDICTION:</strong> This esteemed Global Supreme Court of Instant Justice possesses the sole and ultimate jurisdiction over matters of profound personal grievance, particularly those involving egregious breaches of common courtesy and snack-related offenses.</p>
            </div>
            <div style="margin-bottom: 1em;">
                <h4 style="font-weight: bold;">STATEMENT OF FACTS:</h4>
                <p>On or around the date of ${currentDate}, the Defendant, ${safeDefendant}, did commit a most heinous act, to wit: ${safeCharge}. This action has caused the Plaintiff irreparable harm.</p>
            </div>
            <div style="margin-bottom: 1em;">
                <h4 style="font-weight: bold;">CHARGE:</h4>
                <p>The Defendant is hereby charged with one count of ${safeCharge}, a violation of the universally recognized Statute of Offenses.</p>
            </div>
            <div style="margin-bottom: 1.5em;">
                <h4 style="font-weight: bold;">DEMAND FOR RELIEF:</h4>
                <p>WHEREFORE, PREMISES CONSIDERED, the Plaintiff respectfully requests that this Honorable Court grant the following relief:</p>
                <ol style="list-style-type: lower-alpha; margin-left: 20px;">
                    <li>An immediate and sincere apology from the Defendant, delivered in person with a peace offering (of the Plaintiff's choosing).</li>
                    <li>Monetary compensation in the amount of one (1) imaginary unit of currency, to be used solely for the purchase of further comedic materials.</li>
                    <li>A public acknowledgement of the Defendant's wrongdoing, to be posted on all available social media platforms for a period of no less than twenty-four (24) hours.</li>
                    <li>Any such other relief as this Court deems just and appropriate.</li>
                </ol>
            </div>
            <div style="text-align: right; margin-bottom: 1em; font-size: 0.9em; font-style: italic;">
                <p>Respectfully submitted,</p>
                <p>${lawyerName}</p>
                <p>Attorney for the Plaintiff</p>
                <p>Electronically Filed: ${currentDate}</p>
            </div>
            <div style="text-align: center; margin-top: 2em;">
                <p style="font-size: 1.1em; color: red; font-weight: bold;">[ OFFICIAL GSCIJ SEAL ]</p>
            </div>
            <hr style="border-top: 1px dashed #ccc; margin: 2em 0;">
            `;
    }

    function revealAprilFools() {
        if (aprilFoolsModal) {
            aprilFoolsModal.style.display = 'flex';
            console.log("[Helper] April Fools modal displayed.");
        } else {
            console.error("[Helper] Cannot reveal April Fools: Modal element not found.");
        }
    }

    console.log("[Init] Initial script setup complete. Waiting for user interaction.");

}); // End DOMContentLoaded
