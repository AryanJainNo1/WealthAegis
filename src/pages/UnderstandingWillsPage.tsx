import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UnderstandingWillsPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", my: 6, p: 4, bgcolor: "#fff", borderRadius: 4, boxShadow: 3 }}>
      {/* Return to Resources Button */}
      <Button
        variant="outlined"
        sx={{ mb: 3, borderRadius: 3, fontWeight: 800 }}
        onClick={() => navigate(-1)}
      >
        ← Return to Resources
      </Button>

      <Typography variant="h4" fontWeight={900} gutterBottom>
        Understanding Wills
      </Typography>
      <Typography paragraph>
        A will, often referred to as a last will and testament, is a cornerstone document in estate planning. It provides clear, legally recognized instructions on how a person's property, assets, and responsibilities should be distributed and managed after their death. Without a will, the distribution of assets is determined by statutory laws, which may not reflect the deceased’s true intentions.
      </Typography>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        What is a Will?
      </Typography>
      <Typography paragraph>
        A will is a written declaration by a person, called the testator, expressing how their property and other matters should be handled after their demise. It is enforceable by law and remains inactive until the testator's death [2]. A will allows individuals to name beneficiaries, appoint guardians for minor children, and assign executors to carry out their wishes.
      </Typography>
      <Typography paragraph>
        In its essence, a will ensures that the testator retains control over their estate, even after death, rather than leaving it up to intestacy laws.
      </Typography>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Essential Elements of a Will
      </Typography>
      <Typography paragraph>
        A valid will must generally include the following components:
      </Typography>
      <ul>
        <li><b>Testator’s Details:</b> Full name, address, and a declaration that the document is the person’s last will.</li>
        <li><b>Revocation of Previous Wills:</b> A statement voiding all prior wills.</li>
        <li><b>Appointment of Executor(s):</b> An executor is responsible for managing the estate and ensuring the will's provisions are executed properly [6].</li>
        <li><b>Distribution of Assets:</b> Clear details on who receives what—this can include cash, property, jewelry, or any other possessions.</li>
        <li><b>Guardianship Provisions:</b> If there are minor children, the will can specify a legal guardian.</li>
        <li><b>Signature and Witnesses:</b> The will must be signed by the testator and witnessed by at least two disinterested individuals who are not beneficiaries [4].</li>
      </ul>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Types of Wills
      </Typography>
      <Typography paragraph>
        There are various types of wills, including:
      </Typography>
      <ul>
        <li><b>Simple Will:</b> Most common; used to designate assets and guardians.</li>
        <li><b>Joint Will:</b> Made by two people, typically spouses, to leave their property to each other.</li>
        <li><b>Living Will:</b> Not to be confused with a testamentary will—this document outlines medical treatment preferences in case of incapacity.</li>
        <li><b>Holographic Will:</b> A handwritten will, recognized in some jurisdictions.</li>
        <li><b>Codicil:</b> A legal supplement used to make minor changes to an existing will without rewriting the entire document [3].</li>
      </ul>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Legal Requirements and Formalities
      </Typography>
      <Typography paragraph>
        Laws vary by jurisdiction, but generally, the testator must be:
      </Typography>
      <ul>
        <li>At least 18 years old</li>
        <li>Of sound mind</li>
        <li>Free from undue influence or coercion</li>
      </ul>
      <Typography paragraph>
        Improperly executed wills may be contested or rendered invalid, leading to unintended consequences. Hence, legal advice is often recommended during will preparation [1].
      </Typography>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Importance of Making a Will
      </Typography>
      <Typography paragraph>
        Having a valid will offers numerous advantages:
      </Typography>
      <ul>
        <li><b>Avoids Intestacy:</b> Without a will, state or national laws dictate the division of assets, which may disregard personal relationships or intentions [4].</li>
        <li><b>Reduces Family Conflict:</b> Clear instructions help minimize disputes among heirs.</li>
        <li><b>Efficient Estate Administration:</b> Executors have a roadmap to follow, speeding up the distribution process.</li>
        <li><b>Ensures Care for Dependents:</b> Guardianship designations for children and provisions for dependents or pets can be made [5].</li>
      </ul>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Updating and Storing a Will
      </Typography>
      <Typography paragraph>
        A will should be updated after significant life events—marriage, divorce, birth of a child, or major financial changes. It’s also crucial to store the will securely and inform your executor of its location. Some opt for probate-safe storage services or deposit with a legal professional.
      </Typography>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Conclusion
      </Typography>
      <Typography paragraph>
        Understanding wills is fundamental for ensuring your legacy is protected and your loved ones are cared for according to your wishes. It’s a powerful legal tool that brings peace of mind and clarity, preventing unnecessary confusion or conflict during emotionally challenging times.
      </Typography>
    </Box>
  );
};

export default UnderstandingWillsPage;