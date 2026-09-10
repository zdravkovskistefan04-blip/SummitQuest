namespace SummitQuest.Api.Models;

public class TrailReview
{
    public int Id { get; set; }
    public int TrailId { get; set; }
    public string UserName { get; set; } = "";
    public int Rating { get; set; }
    public string Comment { get; set; } = "";
    public List<string> Tags { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
