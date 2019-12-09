using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles {
  public class Details {
    public class Query : IRequest<ProfileDto> {
      public string Username { get; set; }
    }

    public class Handler : IRequestHandler<Query, ProfileDto> {
      private readonly DataContext _context;

      public Handler(DataContext context) {
        _context = context;
      }

      public async Task<ProfileDto> Handle(Query request, CancellationToken cancellationToken) {
        var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName ==
                                                                 request.Username);
        
        return new ProfileDto {
          DisplayName = user.DisplayName,
          Username = user.UserName,
          Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
          Bio = user.Bio,
          Photos = user.Photos
        };
      }
    }
  }
}