namespace SummitQuest.Api.Models;

public class Quest
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public int XpReward { get; set; }
    public bool IsDaily { get; set; }
    public string QuestType { get; set; } = "";
    public double Progress { get; set; }
    public double Goal { get; set; }
}
