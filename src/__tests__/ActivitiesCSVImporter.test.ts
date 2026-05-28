import { ActivitiesCSVImporter, CSVImportError } from "../ActivitiesCSVImporter";

describe("ActivitiesCSVImporter", () => {
  const header = [
    "Activity ID",
    "Activity Date",
    "Activity Name",
    "Activity Type",
    "Activity Description",
    "Activity Private Note",
    "Elapsed Time",
    "Moving Time",
    "Distance",
    "Max Heart Rate",
    "Max Speed",
    "Average Speed",
    "Elevation Gain",
    "Elevation Low",
    "Elevation High",
    "Calories",
  ].join(",");

  // Use quotes for the date field since it contains commas
  const validRow = [
    "12345678",
    '"Aug 28, 2024, 5:07:43 AM"',
    "Morning Run",
    "Run",
    "Nice run",
    "Note",
    "3600",
    "3500",
    "10000",
    "180",
    "5",
    "4",
    "100",
    "50",
    "150",
    "800",
  ].join(",");

  it("should import valid CSV data correctly", async () => {
    const csvContent = `${header}\n${validRow}`;
    const importer = new ActivitiesCSVImporter(csvContent);
    const activities = await importer.import();

    expect(activities).toHaveLength(1);
    expect(activities[0]).toEqual({
      id: 12345678,
      start_date: new Date("Aug 28, 2024, 5:07:43 AM UTC"),
      name: "Morning Run",
      sport_type: "Run",
      description: "Nice run",
      private_note: "Note",
      elapsed_time: 3600,
      moving_time: 3500,
      distance: 10000,
      max_heart_rate: 180,
      max_speed: 5,
      average_speed: 4,
      total_elevation_gain: 100,
      elev_low: 50,
      elev_high: 150,
      calories: 800,
    });
  });

  it("should throw CSVImportError if CSV parsing fails", async () => {
    // Malformed CSV (e.g., mismatched quotes)
    const csvContent = 'Activity ID,Activity Date\n12345678,"Aug 28, 2024';
    const importer = new ActivitiesCSVImporter(csvContent);

    await expect(importer.import()).rejects.toThrow(CSVImportError);
    await expect(importer.import()).rejects.toThrow(/Failed to parse CSV:/);
  });

  it("should throw CSVImportError if CSV is empty", async () => {
    const csvContent = "";
    const importer = new ActivitiesCSVImporter(csvContent);

    await expect(importer.import()).rejects.toThrow(CSVImportError);
    await expect(importer.import()).rejects.toThrow(
      "The CSV file is empty or contains no valid data.",
    );
  });

  it("should throw CSVImportError if required columns are missing", async () => {
    const incompleteHeader = "Activity ID,Activity Date";
    const csvContent = `${incompleteHeader}\n12345678,"Aug 28, 2024"`;
    const importer = new ActivitiesCSVImporter(csvContent);

    await expect(importer.import()).rejects.toThrow(CSVImportError);
    await expect(importer.import()).rejects.toThrow(/Missing required column\(s\):/);
  });

  it("should throw CSVImportError if date is invalid", async () => {
    const invalidDateRow = [
      "12345678",
      "Invalid Date",
      "Morning Run",
      "Run",
      "", "", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    ].join(",");
    const csvContent = `${header}\n${invalidDateRow}`;
    const importer = new ActivitiesCSVImporter(csvContent);

    await expect(importer.import()).rejects.toThrow(CSVImportError);
    await expect(importer.import()).rejects.toThrow(/Invalid date: Invalid Date UTC/);
  });
});
