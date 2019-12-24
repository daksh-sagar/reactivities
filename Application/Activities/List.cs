using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities {
  public class List {
    public class ActivitiesEnvelope {
      public List<ActivityDto> Activities { get; set; }
      public int ActivityCount { get; set; }
    }

    public class Query : IRequest<List.ActivitiesEnvelope> {
      public Query(int limit, int offset) {
        Limit = limit;
        Offset = offset;
      }

      public int Limit { get; set; }
      public int Offset { get; set; }
    }

    public class Handler : IRequestHandler<Query, List.ActivitiesEnvelope> {
      private readonly DataContext _context;
      private readonly IMapper _mapper;

      public Handler(DataContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
      }

      public async Task<List.ActivitiesEnvelope> Handle(Query request, CancellationToken cancellationToken) {
        var queryable = _context.Activities.AsQueryable();

        var activities = await queryable
          .Skip(request.Offset)
          .Take(request.Limit).ToListAsync();

        return new List.ActivitiesEnvelope {
          Activities = _mapper.Map<List<Activity>, List<ActivityDto>>(activities),
          ActivityCount = queryable.Count()
        };
      }
    }
  }
}