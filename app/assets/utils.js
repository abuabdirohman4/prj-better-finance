import { googleSheetsService } from "@/utils/google";
import Papa from "papaparse";

const parseAssetData = (data) => {
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
        .filter((row) => {
            // Check if row has name field (case insensitive)
            const nameField = row["name"] || row["Name"] || row["NAME"];
            return nameField && nameField.trim() !== "";
        })
        .map((row) => {
            const nameField = row["name"] || row["Name"] || row["NAME"];
            const valueField = row["value"] || row["Value"] || row["VALUE"];
            const typeField = row["type"] || row["Type"] || row["TYPE"];

            return {
                name: nameField.trim(),
                value: parseFloat(valueField) || 0,
                balance: parseFloat(valueField) || 0,
                category: typeField?.trim() || "other",
                type: "Asset",
            };
        });

    return parsedData;
};

export const categorizeAssets = (assets) => {
    const categories = {
        liquid: [],
        investment: [],
        property: [],
        other: [],
    };

    assets.forEach((asset) => {
        const category = asset.category?.toLowerCase() || "other";
        if (category === "liquid") {
            categories.liquid.push(asset);
        } else if (category === "investment") {
            categories.investment.push(asset);
        } else if (category === "property") {
            categories.property.push(asset);
        } else {
            categories.other.push(asset);
        }
    });

    return categories;
};

export const fetchAssetData = async () => {
    try {
        const csvData = await googleSheetsService.read("Assets");
        const parsedData = parseAssetData(csvData);
        return parsedData;
    } catch (error) {
        console.error("Error fetching asset data:", error);
        return [];
    }
};

export const getTotalAssets = (assets) => {
    return assets.reduce((total, asset) => total + asset.balance, 0);
};

export const getAssetBalance = (assets, assetName) => {
    const asset = assets.find((ast) => ast.name === assetName);
    return asset ? asset.balance : 0;
};
