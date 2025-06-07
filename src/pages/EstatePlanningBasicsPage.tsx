import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EstatePlanningBasicsPage = () => {
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
        Estate Planning Basics
      </Typography>
      <Typography>
        Estate planning is a critical process that ensures your assets are distributed according to your wishes after your death or in the event of your incapacitation. Despite its importance, many people overlook or delay estate planning, often believing it’s only necessary for the wealthy. In reality, every adult should have at least a basic estate plan in place.
      </Typography>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        What is Estate Planning?
      </Typography>
      <Typography>
        Estate planning involves organizing your financial affairs and personal wishes so that your estate — everything you own — is managed efficiently in your absence. It includes legal documents that instruct how your assets should be handled, who will be responsible for making decisions, and who will benefit from your estate.
      </Typography>
      <Typography>
        An estate plan typically encompasses:
        <ul>
          <li>A will</li>
          <li>A power of attorney</li>
          <li>A healthcare directive</li>
          <li>Beneficiary designations</li>
          <li>Trusts (in some cases)</li>
        </ul>
        Each component plays a vital role in ensuring a seamless transition of your assets and responsibilities.
      </Typography>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Key Components of a Basic Estate Plan
      </Typography>
      <Typography>
        <b>Last Will and Testament</b><br />
        A will is a foundational document that outlines how you want your assets distributed upon your death. It also allows you to name a guardian for minor children. Without a will, state laws determine who inherits your property, which may not align with your preferences [4].
      </Typography>
      <Typography>
        <b>Power of Attorney (POA)</b><br />
        A durable power of attorney designates someone you trust to manage your finances if you become incapacitated. This can include paying bills, handling investments, or managing property [6].
      </Typography>
      <Typography>
        <b>Healthcare Directive or Living Will</b><br />
        This document outlines your medical preferences and appoints someone (a healthcare proxy) to make healthcare decisions on your behalf if you cannot. It ensures your medical treatment aligns with your values and wishes [6].
      </Typography>
      <Typography>
        <b>Beneficiary Designations</b><br />
        Certain assets like retirement accounts, life insurance policies, and payable-on-death bank accounts are not governed by your will. You must name beneficiaries directly on these accounts and keep them updated.
      </Typography>
      <Typography>
        <b>Trusts</b><br />
        A living trust can help manage and distribute assets more efficiently, especially if privacy or avoiding probate is a concern. Trusts can also protect assets and provide for minors or individuals with special needs [2].
      </Typography>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Why Estate Planning Matters
      </Typography>
      <Typography paragraph>
        <ul>
          <li><b>Avoiding Probate:</b> A solid estate plan can help avoid probate — the legal process of validating a will — which can be time-consuming and expensive.</li>
          <li><b>Reducing Taxes:</b> Strategic estate planning can minimize estate and inheritance taxes, preserving more wealth for your heirs [3].</li>
          <li><b>Preventing Family Disputes:</b> Clearly outlined intentions help prevent conflicts among surviving family members.</li>
          <li><b>Protecting Minor Children and Dependents:</b> Naming guardians and creating trusts ensure that dependents are cared for as intended.</li>
        </ul>
      </Typography>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        When to Start and Update Your Estate Plan
      </Typography>
      <Typography>
        It’s advisable to begin estate planning as soon as you acquire assets or have dependents. Regular reviews are essential — especially after major life changes such as marriage, divorce, childbirth, or significant financial shifts.
      </Typography>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Getting Professional Help
      </Typography>
      <Typography>
        While DIY tools exist, estate planning often requires careful legal and financial considerations. An estate planning attorney can help tailor a plan to your specific circumstances, ensuring compliance with state laws and tax regulations [1].
      </Typography>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Conclusion
      </Typography>
      <Typography>
        Estate planning is not just for the wealthy or elderly. It's a responsible step that provides peace of mind, protects your loved ones, and ensures your legacy is honored. Even a basic estate plan, if thoughtfully constructed and maintained, can make a world of difference when it matters most.
      </Typography>
    </Box>
  );
};

export default EstatePlanningBasicsPage;