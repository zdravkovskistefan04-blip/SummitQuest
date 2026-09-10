namespace SummitQuest.Api.Models;

public class RouteCalculationRequest
{
    public double DistanceKm { get; set; }
    public int EstimatedMinutes { get; set; }
    public string StartName { get; set; } = "";
    public string EndName { get; set; } = "";
}
