namespace SummitQuest.Api.Models;

public class EcoReport
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int TrailId { get; set; }
    public string ProblemType { get; set; } = "";
    public string Description { get; set; } = "";
    public string Status { get; set; } = "Submitted";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
