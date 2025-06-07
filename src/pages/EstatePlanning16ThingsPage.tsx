import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EstatePlanning16ThingsPage = () => {
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
        Estate Planning: 16 Things to Do Before You Die
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Typography>
          Estate planning is the process of arranging the management and disposal of your assets during your lifetime and after death. Many assume it’s only for the wealthy, but in truth, everyone benefits from thoughtful planning. A well-crafted estate plan ensures your wishes are honored, your loved ones are provided for, and legal complications are minimized. Here are 16 essential things to do before you die to ensure your estate is in order.
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>1. Create a Last Will and Testament</Typography>
        <Typography>
          A will outlines how your assets will be distributed upon your death. It names beneficiaries and appoints an executor to carry out your wishes [1].
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>2. Establish a Living Trust</Typography>
        <Typography>
          A living trust helps avoid probate, allows faster asset distribution, and can offer more privacy. It's especially helpful for those with complex estates or out-of-state property [2].
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>3. Appoint a Power of Attorney</Typography>
        <Typography>
          A durable power of attorney allows a trusted person to handle your financial affairs if you're incapacitated [5].
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>4. Draft a Healthcare Directive</Typography>
        <Typography>
          Also known as a living will, this document outlines your medical preferences and appoints a healthcare proxy to make decisions on your behalf [2].
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>5. Review Beneficiary Designations</Typography>
        <Typography>
          Ensure retirement accounts, life insurance policies, and other financial instruments have correct, updated beneficiaries.
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>6. Inventory Your Assets</Typography>
        <Typography>
          Create a comprehensive list of all your assets—real estate, bank accounts, investments, insurance, personal property—and keep it updated [1].
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>7. Include Digital Assets</Typography>
        <Typography>
          Document your online accounts, passwords, cryptocurrency wallets, and designate access rights.
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>8. Plan for Minor Children</Typography>
        <Typography>
          Name guardians in your will to care for underage children. Consider setting up a trust to manage their inheritance responsibly.
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>9. Minimize Estate Taxes</Typography>
        <Typography>
          Consult a tax advisor for strategies like gifting, charitable contributions, or trusts to reduce tax burdens on heirs [3].
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>10. Organize Important Documents</Typography>
        <Typography>
          Store your will, insurance papers, titles, and other key documents in a safe, accessible place. Inform your executor or family where to find them [2].
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>11. Update Your Plan Regularly</Typography>
        <Typography>
          Revisit your estate plan after major life events like marriage, divorce, a birth, or significant financial changes.
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>12. Write a Letter of Intent</Typography>
        <Typography>
          This informal document can communicate your wishes about sentimental belongings, funeral arrangements, or personal messages to loved ones.
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>13. Plan for Pets</Typography>
        <Typography>
          If you have pets, designate a caregiver and set aside funds for their care.
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>14. Consider Long-Term Care</Typography>
        <Typography>
          Factor in the possibility of assisted living or nursing care, and explore long-term care insurance options.
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>15. Consolidate Your Accounts</Typography>
        <Typography>
          Simplify your estate by consolidating multiple bank or investment accounts where possible.
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>16. Work with Professionals</Typography>
        <Typography>
          Hire an estate planning attorney, financial advisor, and tax expert to help you create a legally sound and effective plan [5].
        </Typography>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>Final Thoughts</Typography>
        <Typography>
          Estate planning is a gift to your family—sparing them from unnecessary stress, legal confusion, and potential conflicts. Starting early and updating regularly ensures your wishes are carried out exactly as you envision, while also securing peace of mind during your lifetime.
        </Typography>
      </Box>
    </Box>
  );
}

export default EstatePlanning16ThingsPage;