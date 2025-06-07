import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HowToWriteAWillPage() {
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
            How to Write a Will: The Complete Guide
        </Typography>
        <Typography>
            Creating a will is one of the most essential steps in estate planning. A will not only allows you to dictate how your assets are distributed but also gives you the power to appoint guardians for minor children, name executors, and ensure that your loved ones are taken care of after your passing. Here's a complete step-by-step guide to writing a legally sound will.
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>1. Understand the Purpose of a Will</Typography>
        <Typography>
            A will is a legal document that communicates your wishes about the distribution of your property, guardianship of dependents, and any specific instructions after death. Without one, the law decides who inherits your estate, which may not align with your intentions [4].
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>2. Prepare a Comprehensive Inventory</Typography>
        <Typography>
            Start by listing all your assets and liabilities. Include real estate, bank accounts, investments, jewelry, insurance policies, digital assets, and personal possessions [1]. Also, gather supporting documents like property deeds and insurance papers.
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>3. Identify Your Beneficiaries</Typography>
        <Typography>
            Clearly name the individuals or organizations who will inherit your assets. Specify full names and relationships to avoid confusion or disputes. You can leave specific items or percentages of your estate to each beneficiary [1].
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>4. Appoint an Executor</Typography>
        <Typography>
            The executor is the person responsible for administering your estate and ensuring your wishes are carried out. Choose someone trustworthy, organized, and ideally younger than you. You may also appoint a backup executor in case the first choice is unable to serve [2].
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>5. Name Guardians for Minor Children</Typography>
        <Typography>
            If you have children under 18, naming a guardian in your will is crucial. This person will assume legal responsibility for your children if something happens to both parents. Ensure the guardian is willing and capable of fulfilling this role [2].
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>6. Write Specific Bequests and Instructions</Typography>
        <Typography>
            Clearly outline who gets what, including specific gifts (like jewelry or heirlooms) and broader instructions (such as “divide the remaining estate equally among my children”). You can also include funeral or memorial wishes, though it's advisable to inform your family separately as wills are often read after the funeral [5].
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>7. Sign the Will with Witnesses</Typography>
        <Typography>
            To be legally valid, a will must be signed by the testator in the presence of at least two adult witnesses, who must also sign the document. Witnesses should not be beneficiaries to avoid conflicts of interest [6].
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>8. Store the Will Safely</Typography>
        <Typography>
            Keep the signed original will in a secure location like a home safe, bank locker, or with your attorney. Let your executor and family members know where it's stored. You may also register it with a government or private will registry [3].
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>9. Review and Update Regularly</Typography>
        <Typography>
            Life changes like marriage, divorce, the birth of a child, or acquiring new assets may require updates to your will. You can add a codicil (a legal amendment) or draft a new will altogether. Make sure to revoke the previous version if creating a new one [4].
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>Final Thoughts</Typography>
        <Typography>
            Writing a will doesn't have to be complicated. With careful planning and clear instructions, you can secure your family's future and ensure that your legacy is preserved as you intended. For complex estates, consulting a legal professional is always a wise choice.
        </Typography>
    </Box>
  );
}