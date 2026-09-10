namespace SummitQuest.Api.Models;

public class CommunityMatch
{
    public int Id { get; set; }
    public string FullName { get; set; } = "";
    public string RankTitle { get; set; } = "";
    public string PreferredPace { get; set; } = "";
    public string FavoriteTrailType { get; set; } = "";
    public int MatchPercent { get; set; }
}
