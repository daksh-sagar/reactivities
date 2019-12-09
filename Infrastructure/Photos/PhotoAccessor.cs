﻿using System;
using System.Net;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos {
  public class PhotoAccessor : IPhotoAccessor {
    private readonly Cloudinary _cloudinary;

    public PhotoAccessor(IOptions<CloudinarySettings> config) {
      var account = new Account(
        config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);

      _cloudinary = new Cloudinary(account);
    }

    public async Task<PhotoUploadResult> AddPhoto(IFormFile file) {
      if (file.Length > 0 && file.ContentType.Contains("image")) {
        ImageUploadResult uploadResult;
        using (var stream = file.OpenReadStream()) {
          var uploadParams = new ImageUploadParams {
            File = new FileDescription(file.FileName, stream),
            Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
          };
          uploadResult = await _cloudinary.UploadAsync(uploadParams);
        }

        if (uploadResult.Error != null)
          throw new Exception(uploadResult.Error.Message);

        return new PhotoUploadResult {
          PublicId = uploadResult.PublicId,
          Url = uploadResult.SecureUri.AbsoluteUri
        };
      }

      throw new RestException(HttpStatusCode.BadRequest, new {
        InvalidFile = "Selected file not a valid image"
      });
    }

    public string DeletePhoto(string publicId) {
      var deleteParams = new DeletionParams(publicId);

      var result = _cloudinary.Destroy(deleteParams);
      return result.Result == "ok" ? result.Result : null;
    }
  }
}