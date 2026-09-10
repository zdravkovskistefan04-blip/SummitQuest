using SummitQuest.Api.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("VueApp", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins("http://localhost:7235", "http://127.0.0.1:7235");
    });
});

var app = builder.Build();
app.UseCors("VueApp");

var user = new User
{
    Id = 1,
    FullName = "Александар Планинар",
    Email = "alex@summitquest.com",
    Xp = 1240,
    Level = 3,
    RankTitle = "Истражувач на патеки",
    TotalDistanceKm = 28.4,
    TotalElevationM = 1780,
    CompletedTrails = 6,
    EcoPoints = 100,
    PreferredPace = "Medium",
    FavoriteTrailType = "Mountain"
};

var trails = new List<Trail>
{
    new Trail
    {
        Id = 1,
        Name = "Патека Титов Врв",
        Location = "Шар Планина",
        DistanceKm = 4.8,
        ElevationGainM = 720,
        Difficulty = "Medium",
        Type = "Mountain",
        EstimatedMinutes = 135,
        XpReward = 430,
        Description = "Панорамска планинска рута со контролни точки, гребенски погледи и прекрасен врв.",
        MapPoints = new()
        {
            new TrailPoint { X = 18, Y = 84 },
            new TrailPoint { X = 34, Y = 70 },
            new TrailPoint { X = 28, Y = 57 },
            new TrailPoint { X = 55, Y = 44 },
            new TrailPoint { X = 47, Y = 28 },
            new TrailPoint { X = 73, Y = 12 }
        }
    },
    new Trail
    {
        Id = 2,
        Name = "Ноќна патека на Водно",
        Location = "Vodno",
        DistanceKm = 3.5,
        ElevationGainM = 280,
        Difficulty = "Easy",
        Type = "Forest",
        EstimatedMinutes = 75,
        XpReward = 250,
        Description = "Кратка шумска рута за почетници и вечерни прошетки.",
        MapPoints = new()
        {
            new TrailPoint { X = 20, Y = 78 },
            new TrailPoint { X = 36, Y = 65 },
            new TrailPoint { X = 50, Y = 58 },
            new TrailPoint { X = 62, Y = 38 },
            new TrailPoint { X = 76, Y = 25 }
        }
    },
    new Trail
    {
        Id = 3,
        Name = "Утринско искачување на Пелистер",
        Location = "Pelister",
        DistanceKm = 7.2,
        ElevationGainM = 940,
        Difficulty = "Hard",
        Type = "Peak",
        EstimatedMinutes = 210,
        XpReward = 650,
        Description = "Предизвикувачко утринско искачување со технички делови и голема XP награда.",
        MapPoints = new()
        {
            new TrailPoint { X = 14, Y = 88 },
            new TrailPoint { X = 30, Y = 76 },
            new TrailPoint { X = 24, Y = 61 },
            new TrailPoint { X = 48, Y = 50 },
            new TrailPoint { X = 42, Y = 35 },
            new TrailPoint { X = 66, Y = 22 },
            new TrailPoint { X = 78, Y = 8 }
        }
    }
};

var quests = new List<Quest>
{
    new Quest { Id = 1, Title = "Walk 5 km", Description = "Complete 5 km today to unlock bonus XP.", XpReward = 150, IsDaily = true, QuestType = "Distance", Progress = 2.4, Goal = 5 },
    new Quest { Id = 2, Title = "Vibe Check", Description = "Leave one Vibe-Check review on a trail.", XpReward = 75, IsDaily = true, QuestType = "Community", Progress = 0, Goal = 1 },
    new Quest { Id = 3, Title = "Eco Guardian", Description = "Report one trail problem or trash location.", XpReward = 90, IsDaily = true, QuestType = "Eco", Progress = 0, Goal = 1 }
};

var achievements = new List<Achievement>
{
    new Achievement { Id = 1, Name = "Night Hiker", Description = "Complete a night trail.", Icon = "🌙", RequiredXp = 300 },
    new Achievement { Id = 2, Name = "Peak Bagger", Description = "Complete 3 trails.", Icon = "⛰️", RequiredXp = 800 },
    new Achievement { Id = 3, Name = "Forest Ranger", Description = "Earn 100 Eco Points.", Icon = "🌲", RequiredXp = 0 },
    new Achievement { Id = 4, Name = "Mountain Goat", Description = "Reach 5000 XP.", Icon = "🐐", RequiredXp = 5000 }
};

var matches = new List<CommunityMatch>
{
    new CommunityMatch { Id = 2, FullName = "Martina Trail", RankTitle = "Trail Explorer", PreferredPace = "Medium", FavoriteTrailType = "Forest", MatchPercent = 87 },
    new CommunityMatch { Id = 3, FullName = "Stefan Peak", RankTitle = "Peak Hunter", PreferredPace = "Fast", FavoriteTrailType = "Mountain", MatchPercent = 72 },
    new CommunityMatch { Id = 4, FullName = "Elena Sunrise", RankTitle = "Beginner", PreferredPace = "Medium", FavoriteTrailType = "Sunrise hikes", MatchPercent = 81 }
};

var vibeTags = new List<string>
{
    "Премногу гужва",
    "Скриен поглед",
    "Технички тешко",
    "Добро за почетници",
    "Мирна патека",
    "Одлично за фотографии",
    "Лизгава патека",
    "Потребна кондиција"
};

var reviews = new List<TrailReview>
{
    new TrailReview { Id = 1, TrailId = 1, UserName = "Martina", Rating = 5, Comment = "Одлична патека со многу добар поглед.", Tags = new() { "Скриен поглед", "Потребна кондиција" } },
    new TrailReview { Id = 2, TrailId = 1, UserName = "Stefan", Rating = 4, Comment = "Убава рута, но има технички делови.", Tags = new() { "Технички тешко", "Одлично за фотографии" } }
};

var ecoReports = new List<EcoReport>
{
    new EcoReport { Id = 1, UserId = 1, TrailId = 1, ProblemType = "Trash", Description = "Отпад до checkpoint 2." }
};

app.MapGet("/", () => new { App = "Summit Quest API", Status = "Running", Database = "No real database, data is stored in memory" });

app.MapGet("/api/auth/demo-login", () => Results.Ok(user));
app.MapGet("/api/users/{id:int}", (int id) => Results.Ok(user));
app.MapGet("/api/users/profile", () => Results.Ok(user));

app.MapGet("/api/trails", () => Results.Ok(trails));
app.MapGet("/api/trails/{id:int}", (int id) =>
{
    var trail = trails.FirstOrDefault(t => t.Id == id);
    return trail is null ? Results.NotFound() : Results.Ok(trail);
});

app.MapGet("/api/trails/{id:int}/map", (int id) =>
{
    var trail = trails.FirstOrDefault(t => t.Id == id);
    return trail is null ? Results.NotFound() : Results.Ok(trail);
});

app.MapPost("/api/trails/{id:int}/start", (int id) =>
{
    var trail = trails.FirstOrDefault(t => t.Id == id);
    return trail is null ? Results.NotFound() : Results.Ok(new { TrekId = Random.Shared.Next(1000, 9999), TrailId = id, StartedAt = DateTime.UtcNow, Message = "START TREK activated" });
});

app.MapPost("/api/trails/{id:int}/finish", (int id) =>
{
    var trail = trails.FirstOrDefault(t => t.Id == id);
    if (trail is null) return Results.NotFound();

    user.Xp += trail.XpReward;
    user.TotalDistanceKm += trail.DistanceKm;
    user.TotalElevationM += trail.ElevationGainM;
    user.CompletedTrails += 1;

    return Results.Ok(new { Message = "Quest Complete!", EarnedXp = trail.XpReward, Badge = "Peak Bagger", Trail = trail.Name, User = user });
});

app.MapGet("/api/quests/daily", () => Results.Ok(quests));
app.MapPost("/api/quests/{id:int}/complete", (int id) =>
{
    var quest = quests.FirstOrDefault(q => q.Id == id);
    if (quest is null) return Results.NotFound();

    quest.Progress = quest.Goal;
    user.Xp += quest.XpReward;

    return Results.Ok(new { Message = "Quest completed!", Quest = quest, User = user });
});

app.MapGet("/api/achievements", () => Results.Ok(achievements));

app.MapGet("/api/community/matches", (int userId) => Results.Ok(matches));

app.MapGet("/api/vibe-check/tags", () => Results.Ok(vibeTags));
app.MapGet("/api/trails/{id:int}/reviews", (int id) => Results.Ok(reviews.Where(r => r.TrailId == id).OrderByDescending(r => r.CreatedAt)));

app.MapPost("/api/trails/{id:int}/reviews", (int id, TrailReview review) =>
{
    review.Id = reviews.Count + 1;
    review.TrailId = id;
    review.CreatedAt = DateTime.UtcNow;
    if (string.IsNullOrWhiteSpace(review.UserName)) review.UserName = "Guest Hiker";
    reviews.Add(review);
    return Results.Ok(review);
});

app.MapGet("/api/eco-reports", () => Results.Ok(ecoReports));
app.MapPost("/api/eco-reports", (EcoReport report) =>
{
    report.Id = ecoReports.Count + 1;
    report.CreatedAt = DateTime.UtcNow;
    report.Status = "Submitted";
    ecoReports.Add(report);
    user.EcoPoints += 50;
    return Results.Ok(new { Message = "Eco report submitted!", Reward = 50, Report = report, User = user });
});

app.MapPost("/api/routes/calculate", (RouteCalculationRequest request) =>
{
    var distanceXp = (int)Math.Round(request.DistanceKm * 55);
    var timeXp = Math.Max(20, request.EstimatedMinutes / 2);
    var xpReward = distanceXp + timeXp;

    var difficulty = request.DistanceKm switch
    {
        < 3 => "Easy",
        < 8 => "Medium",
        _ => "Hard"
    };

    return Results.Ok(new
    {
        request.StartName,
        request.EndName,
        DistanceKm = Math.Round(request.DistanceKm, 2),
        request.EstimatedMinutes,
        XpReward = xpReward,
        Difficulty = difficulty
    });
});

app.Run();
