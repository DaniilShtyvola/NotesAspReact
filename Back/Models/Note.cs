using System.ComponentModel.DataAnnotations;

namespace Notes.Models
{
    public class Note
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public string? UserId { get; set; }

        [Required(ErrorMessage = "Title is required")]
        public string? Title { get; set; }

        [Required(ErrorMessage = "Text is required")]
        public string? Text { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
