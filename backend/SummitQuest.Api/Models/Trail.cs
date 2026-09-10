namespace SummitQuest.Api.Models;

public class Trail
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Location { get; set; } = "";
    public double DistanceKm { get; set; }
    public int ElevationGainM { get; set; }
    public string Difficulty { get; set; } = "";
    public string Type { get; set; } = "";
    public int EstimatedMinutes { get; set; }
    public int XpReward { get; set; }
    public string Description { get; set; } = "";
    public List<TrailPoint> MapPoints { get; set; } = new();
}
