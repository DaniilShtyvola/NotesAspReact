namespace Notes.Models
{
    public class UserData
    {
        public required string Id { get; set; }
        public required string UserName { get; set; }
        public required string Email { get; set; }
        public IEnumerable<string>? Roles { get; set; }
    }
}
