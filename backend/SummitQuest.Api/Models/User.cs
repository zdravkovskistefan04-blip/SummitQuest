namespace SummitQuest.Api.Models;

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = "";
    public string Email { get; set; } = "";
    public int Xp { get; set; }
    public int Level { get; set; }
    public string RankTitle { get; set; } = "";
    public double TotalDistanceKm { get; set; }
    public int TotalElevationM { get; set; }
    public int CompletedTrails { get; set; }
    public int EcoPoints { get; set; }
    public string PreferredPace { get; set; } = "";
    public string FavoriteTrailType { get; set; } = "";
}
