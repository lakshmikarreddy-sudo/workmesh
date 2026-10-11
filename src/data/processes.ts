import { Process } from "../types/workmesh";

export const customerSupportProcess: Process = {
  id: "customer-support",
  name: "Customer Support",
  description:
    "Analyze how customer-support work could be distributed across humans, AI and automation.",
  tasks: [
    {
      id: "receive-request",
      order: 1,
      name: "Receive customer request",
      description: "Receive and register an incoming customer request.",
      assessment: {
        repetition: 5,
        judgment: 1,
        risk: 1,
        humanInteraction: 2,
        dataDependency: 3,
        complexity: 1,
      },
    },

    {
      id: "classify-request",
      order: 2,
      name: "Classify request",
      description:
        "Identify the type and category of the customer's request.",
      assessment: {
        repetition: 5,
        judgment: 2,
        risk: 1,
        humanInteraction: 1,
        dataDependency: 5,
        complexity: 2,
      },
    },

    {
      id: "search-knowledge",
      order: 3,
      name: "Search knowledge",
      description:
        "Find relevant information from the organization's knowledge base.",
      assessment: {
        repetition: 5,
        judgment: 2,
        risk: 2,
        humanInteraction: 1,
        dataDependency: 5,
        complexity: 2,
      },
    },

    {
      id: "determine-resolution",
      order: 4,
      name: "Determine resolution",
      description:
        "Determine the appropriate response or resolution for the customer.",
      assessment: {
        repetition: 3,
        judgment: 4,
        risk: 3,
        humanInteraction: 2,
        dataDependency: 5,
        complexity: 4,
      },
    },

    {
      id: "approve-sensitive-action",
      order: 5,
      name: "Approve sensitive action",
      description:
        "Approve a high-impact action such as compensation or account changes.",
      assessment: {
        repetition: 2,
        judgment: 5,
        risk: 5,
        humanInteraction: 3,
        dataDependency: 3,
        complexity: 4,
      },
    },

    {
      id: "update-crm",
      order: 6,
      name: "Update CRM",
      description:
        "Record the outcome and required information in the CRM.",
      assessment: {
        repetition: 5,
        judgment: 1,
        risk: 1,
        humanInteraction: 1,
        dataDependency: 4,
        complexity: 1,
      },
    },

    {
      id: "send-response",
      order: 7,
      name: "Send response",
      description:
        "Prepare and send the final response to the customer.",
      assessment: {
        repetition: 4,
        judgment: 3,
        risk: 3,
        humanInteraction: 5,
        dataDependency: 4,
        complexity: 3,
      },
    },

    {
      id: "close-case",
      order: 8,
      name: "Close case",
      description:
        "Complete final checks and close the support case.",
      assessment: {
        repetition: 5,
        judgment: 1,
        risk: 1,
        humanInteraction: 1,
        dataDependency: 3,
        complexity: 1,
      },
    },
  ],
};