import { googleSheetsService } from "@/utils/google";
import { accountCategories } from "@/utils/constants";
import Papa from "papaparse";

const parseAccountData = (data) => {
    // Parse CSV using PapaParse
    const result = Papa.parse(data, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => {
            // Clean up header names
            const cleanHeader = header.replace(/"/g, "").trim();
            return cleanHeader;
        },
        transform: (value) => {
            // Clean up cell values
            let cleanValue = value.replace(/"/g, "").trim();
            if (
                cleanValue === "  - " ||
                cleanValue === " - " ||
                cleanValue === ""
            ) {
                cleanValue = "0";
            }
            return cleanValue;
        },
    });

    // Filter out rows without required fields and convert to proper format
    const parsedData = result.data
        .filter((row) => row["Name"] && row["Name"].trim() !== "")
        .map((row) => ({
            name: row["Name"].trim(),
            value: parseFloat(row["Value"]) || 0,
            balance: parseFloat(row["Value"]) || 0,
        }));

    return parsedData;
};

export const categorizeAccounts = (accounts) => {
    const categories = {
        wallet: [],
        atm: [],
        platform: [],
        other: [],
    };

    accounts.forEach((account) => {
        if (accountCategories.wallet.includes(account.name)) {
            categories.wallet.push(account);
        } else if (accountCategories.atm.includes(account.name)) {
            categories.atm.push(account);
        } else if (accountCategories.platform.includes(account.name)) {
            categories.platform.push(account);
        } else {
            categories.other.push(account);
        }
    });

    return categories;
};

export const fetchAccountData = async () => {
    try {
        const csvData = await googleSheetsService.read("Summary");
        const parsedData = parseAccountData(csvData);
        return parsedData;
    } catch (error) {
        console.error("Error fetching account data:", error);
        return [];
    }
};

export const getTotalBalance = (accounts) => {
    return accounts.reduce((total, account) => total + account.balance, 0);
};

export const getAccountBalance = (accounts, accountName) => {
    const account = accounts.find((acc) => acc.name === accountName);
    return account ? account.balance : 0;
};
