import jsPDF from "jspdf";
export function generateWillPDF({ user, contacts, assets, assetBeneficiaries, }) {
    const doc = new jsPDF();
    let y = 22;
    // Title
    doc.setFontSize(22);
    doc.setFont("times", "bold");
    doc.text("Last Will and Testament", 105, y, { align: "center" });
    y += 15;
    // Declaration
    doc.setFontSize(13);
    doc.setFont("times", "italic");
    doc.text(`I, ${user.name}, of ${user.address || "________________"}, being of sound mind, declare this document to be my Last Will and Testament.`, 20, y, { maxWidth: 170 });
    y += 18;
    // Personal Info Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("Personal Information", 20, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Full Name: ${user.name}`, 20, y);
    y += 6;
    doc.text(`Address: ${user.address || "________________"}`, 20, y);
    y += 6;
    doc.text(`Email: ${user.email}`, 20, y);
    y += 10;
    // Appointments Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("Appointments", 20, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    // Executors
    const executors = contacts.filter(c => c.category === "executor" && c.name.trim());
    if (executors.length) {
        doc.setFont("helvetica", "bold");
        doc.text("Executor(s):", 22, y);
        doc.setFont("helvetica", "normal");
        y += 6;
        executors.forEach((c) => {
            doc.text(`- ${c.name} (${c.relationship}) | Email: ${c.email} | Phone: ${c.phone}`, 26, y);
            y += 6;
        });
        y += 2;
    }
    // Alternate Executors
    const altExecutors = contacts.filter(c => c.category === "alternateExecutor" && c.name.trim());
    if (altExecutors.length) {
        doc.setFont("helvetica", "bold");
        doc.text("Alternate Executor(s):", 22, y);
        doc.setFont("helvetica", "normal");
        y += 6;
        altExecutors.forEach((c) => {
            doc.text(`- ${c.name} (${c.relationship}) | Email: ${c.email} | Phone: ${c.phone}`, 26, y);
            y += 6;
        });
        y += 2;
    }
    // Guardian Section (PROFESSIONAL & SEPARATE)
    const guardians = contacts.filter(c => c.category === "guardian" && c.name.trim());
    if (guardians.length) {
        doc.setFont("helvetica", "bold");
        doc.text("Guardian(s) for Minor Children:", 22, y);
        doc.setFont("helvetica", "normal");
        y += 6;
        guardians.forEach((c) => {
            doc.text(`- ${c.name}${c.relationship ? " (" + c.relationship + ")" : ""} | Email: ${c.email} | Phone: ${c.phone}`, 26, y);
            y += 6;
        });
        // Legal statement for guardianship
        y += 2;
        doc.setFont("helvetica", "italic");
        doc.text("I appoint the above-named person(s) as guardian(s) for my minor children, if any, at the time of my passing.", 26, y, { maxWidth: 160 });
        y += 10;
        doc.setFont("helvetica", "normal");
    }
    // Witnesses
    const witnesses = contacts.filter(c => c.category === "witness" && c.name.trim());
    if (witnesses.length) {
        doc.setFont("helvetica", "bold");
        doc.text("Witness(es):", 22, y);
        doc.setFont("helvetica", "normal");
        y += 6;
        witnesses.forEach((c) => {
            doc.text(`- ${c.name} (${c.relationship}) | Email: ${c.email} | Phone: ${c.phone}`, 26, y);
            y += 6;
        });
        y += 2;
    }
    // Assets & Beneficiaries Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("Assets and Distribution", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    assets.forEach((asset) => {
        doc.setFont("helvetica", "bold");
        doc.text(`Asset: ${asset.name} (${asset.type}) - $${asset.value.toLocaleString()} [${asset.status || "Active"}]`, 22, y);
        y += 6;
        const bens = assetBeneficiaries[asset.id] || {};
        const benEntries = Object.entries(bens);
        if (benEntries.length) {
            benEntries.forEach(([benId, percent]) => {
                const ben = contacts.find((c) => c.id === benId);
                if (ben) {
                    doc.setFont("helvetica", "normal");
                    doc.text(`→ ${ben.name}: ${percent}%`, 28, y);
                    y += 5;
                }
            });
        }
        else {
            doc.setFont("helvetica", "italic");
            doc.text("→ No beneficiaries assigned.", 28, y);
            y += 5;
        }
        y += 2;
    });
    y += 8;
    // Beneficiaries Section (aggregate)
    const beneficiaryContacts = contacts.filter((c) => c.category === "beneficiary" && c.name.trim());
    if (beneficiaryContacts.length) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.text("List of Beneficiaries", 20, y);
        y += 8;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        beneficiaryContacts.forEach((b) => {
            doc.text(`- ${b.name} (${b.relationship}) | Email: ${b.email} | Phone: ${b.phone}`, 22, y);
            y += 6;
        });
        y += 2;
    }
    // Standard Clauses
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("General Provisions", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("This will revokes all prior wills and codicils. I direct that my just debts, funeral expenses, and expenses of administering my estate be paid as soon as practical.", 20, y, { maxWidth: 170 });
    y += 14;
    doc.text("IN WITNESS WHEREOF, I have signed this Will on this date:", 20, y);
    y += 14;
    // Signature Lines
    doc.setFont("helvetica", "normal");
    doc.text("_____________________________", 20, y);
    doc.text("Signature of Testator", 120, y);
    y += 10;
    // Witness lines
    doc.text("_____________________________", 20, y);
    doc.text("Signature of Witness", 120, y);
    y += 10;
    doc.text("_____________________________", 20, y);
    doc.text("Signature of Witness", 120, y);
    y += 12;
    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const date = new Date().toLocaleDateString();
    doc.text(`Generated by EstateManager on ${date}`, 105, 295, { align: "center" });
    doc.save("Estate_Will.pdf");
}
